import { MarketCreated, BetPlaced, MarketResolved, WinningsWithdrawn } from "../generated/PariMutuelBetting/IPariMutuelBetting";
import { MarketCreated as MarketCreatedEntity, BetPlaced as BetPlacedEntity, MarketResolved as MarketResolvedEntity, WinningsWithdrawn as WinningsWithdrawnEntity } from "../generated/schema";

// export function handleMarketCreated(event: MarketCreated): void {
//   let entity = new MarketCreatedEntity(event.params.marketId.toString());
//   entity.marketId = event.params.marketId.toString(); // Convert BigInt to String
//   entity.question = event.params.question;

//   // Convert each outcome to String
//   let outcomes: Array<string> = [];
//   for (let i = 0; i < event.params.outcomes.length; i++) {
//     outcomes.push(event.params.outcomes[i].toString());
//   }
//   entity.outcomes = outcomes;

//   entity.imageUri = event.params.imageUri;
//   entity.save();
// }
export function handleMarketCreated(event: MarketCreated): void {
  let entity = new MarketCreatedEntity(event.params.marketId.toString());
  entity.marketId = event.params.marketId.toString();
  entity.question = event.params.question;
  entity.outcomes = event.params.outcomes.join(","); // Convert array to a single string
  entity.imageUri = event.params.imageUri;
  entity.save();
}

export function handleBetPlaced(event: BetPlaced): void {
  let entity = new BetPlacedEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.marketId = event.params.marketId.toString(); // Convert BigInt to String
  entity.user = event.params.user; // Convert address to String
  entity.outcomeIndex = event.params.outcomeIndex.toString(); // Convert BigInt to String
  entity.amount = event.params.amount.toString(); // Convert BigInt to String
  entity.save();
}

export function handleMarketResolved(event: MarketResolved): void {
  let entity = new MarketResolvedEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.marketId = event.params.marketId.toString(); // Convert BigInt to String
  entity.winningOutcomeIndex = event.params.winningOutcomeIndex.toString(); // Convert BigInt to String
  entity.save();
}

export function handleWinningsWithdrawn(event: WinningsWithdrawn): void {
  let entity = new WinningsWithdrawnEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.marketId = event.params.marketId.toString(); // Convert BigInt to String
  entity.user = event.params.user; // Convert address to String
  entity.amount = event.params.amount.toString(); // Convert BigInt to String
  entity.save();
}
