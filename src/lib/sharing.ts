import { supabase } from "./supabase";
import { SHARED_TRIP_SELECT, type Leg, type SharedTrip, type Stop, type Trip } from "../types";

export async function fetchSharedFeed(): Promise<SharedTrip[]> {
  const { data, error } = await supabase
    .from("shared_trips")
    .select(SHARED_TRIP_SELECT)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as SharedTrip[];
}

export async function fetchSharedTrip(id: string): Promise<SharedTrip | null> {
  const { data, error } = await supabase
    .from("shared_trips")
    .select(SHARED_TRIP_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as SharedTrip) ?? null;
}

// 現在の行程表(stops/legs)のスナップショットをshared_tripsへ公開(insert)し、
// 発行された行のidを返す。Tripのsharedidに保存しておくと再公開(update)に使える。
export async function publishTrip(
  trip: Trip,
  stops: Stop[],
  legs: Leg[],
  userId: string,
  description: string | null
): Promise<string> {
  const snapshot = {
    area: trip.area,
    plannedNights: trip.plannedNights,
    startDateTime: trip.startDateTime,
    currency: trip.currency,
    stops,
    legs,
  };

  if (trip.sharedId) {
    const { error } = await supabase
      .from("shared_trips")
      .update({ title: trip.title, description, snapshot })
      .eq("id", trip.sharedId);
    if (error) throw error;
    return trip.sharedId;
  }

  const { data, error } = await supabase
    .from("shared_trips")
    .insert({ user_id: userId, title: trip.title, description, snapshot })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function unpublishTrip(sharedId: string): Promise<void> {
  const { error } = await supabase.from("shared_trips").delete().eq("id", sharedId);
  if (error) throw error;
}

export async function likeSharedTrip(sharedTripId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("shared_trip_likes")
    .insert({ shared_trip_id: sharedTripId, user_id: userId });
  if (error) throw error;
}

export async function unlikeSharedTrip(sharedTripId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("shared_trip_likes")
    .delete()
    .eq("shared_trip_id", sharedTripId)
    .eq("user_id", userId);
  if (error) throw error;
}
