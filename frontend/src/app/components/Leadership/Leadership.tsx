"use client"

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { formatEther } from 'viem'
// Define TypeScript types for the data
type BetPlaced = {
  amount: string;
  marketId: string;
  user: string;
};

type BetPlacedsData = {
  betPlaceds: BetPlaced[];
};

type BetPlacedsVars = {
  marketId: string;
};

// GraphQL query with marketId variable
const GET_BETS = gql`
  query GetBets($marketId: String!) {
    betPlaceds(where: { marketId: $marketId }) {
      amount
      marketId
      user
    }
  }
`;

type LeadershipProps = {
  marketId: string;
};

// Function to process the data
function processBets(betPlaceds: BetPlaced[]) {
  const leadershipData: { [user: string]: number } = {};

  betPlaceds.forEach(({ user, amount }) => {
    if (!leadershipData[user]) {
      leadershipData[user] = 0;
    }
    leadershipData[user] += parseInt(amount, 10);
  });

  // Sort users by total bet amount in descending order
  const sortedUsers = Object.entries(leadershipData).sort(([, a], [, b]) => b - a);

  return sortedUsers;
}

function Leadership({ marketId }: LeadershipProps) {
  const { loading, error, data } = useQuery<BetPlacedsData, BetPlacedsVars>(GET_BETS, {
    variables: { marketId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const sortedUsers = processBets(data?.betPlaceds || []);

  return (
    <div>
      <p>Leadership for Market ID: {marketId}</p>
      <ul className='ulmid'>
        {sortedUsers.map(([user, totalBet]) => (
          <li key={user}>
            User: {user}, Total Bet: {formatEther(BigInt(totalBet))} ETH
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leadership;
