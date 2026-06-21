"use server";

export async function getValueAction(myValue: string) {
  return "test value from server: " + myValue;
}