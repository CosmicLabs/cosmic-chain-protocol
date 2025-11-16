const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

// 1. syncChainSummary - Sync chain summary data every 30 seconds
exports.syncChainSummary = functions.pubsub
  .schedule('every 30 seconds')
  .onRun(async (context) => {
    try {
      // Call local Cosmic node HTTP API
      const response = await axios.get('http://localhost:8081/status');
      const statsResponse = await axios.get('http://localhost:8081/stats');
      
      const chainData = {
        network: "testnet-1",
        currentHeight: response.data.height,
        currentEra: response.data.era,
        currentReward: response.data.reward,
        totalSupply: statsResponse.data.total_supply,
        circulatingSupply: statsResponse.data.circulating_supply,
        burnedAmount: statsResponse.data.burned_amount,
        qleStatus: statsResponse.data.qle_status || "inactive",
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('chain_summary').doc('testnet-1').set(chainData);
      console.log('Chain summary updated');
    } catch (error) {
      console.error('Error syncing chain summary:', error);
    }
  });

// 2. syncWalletRewards - Sync wallet rewards every 10 minutes
exports.syncWalletRewards = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    try {
      // Get all tracked wallets
      const walletSnapshot = await db.collection('miner_wallets').get();
      
      for (const doc of walletSnapshot.docs) {
        const wallet = doc.data();
        try {
          // Query node for wallet rewards
          const rewardResponse = await axios.get(
            `http://localhost:8081/wallets/${wallet.walletAddress}/rewards`
          );
          
          // Store reward snapshots
          for (const reward of rewardResponse.data.rewards) {
            await db.collection('reward_snapshots').add({
              walletAddress: wallet.walletAddress,
              userId: wallet.userId,
              height: reward.height,
              era: reward.era,
              reward: reward.amount,
              timestamp: admin.firestore.Timestamp.fromDate(new Date(reward.timestamp))
            });
          }
          
          // Update metrics summary
          const summaryData = {
            entityType: "wallet",
            walletAddress: wallet.walletAddress,
            userId: wallet.userId,
            network: "testnet-1",
            totalRewards: rewardResponse.data.total_rewards,
            erasParticipated: rewardResponse.data.eras_participated,
            lastRewardAt: rewardResponse.data.last_reward_at ? 
              admin.firestore.Timestamp.fromDate(new Date(rewardResponse.data.last_reward_at)) : 
              null,
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          const summaryId = `wallet-${wallet.walletAddress}`;
          await db.collection('metrics_summary').doc(summaryId).set(summaryData);
        } catch (error) {
          console.error(`Error syncing rewards for ${wallet.walletAddress}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in syncWalletRewards:', error);
    }
  });

// 3. syncNodeSessions - Sync node sessions every 5 minutes
exports.syncNodeSessions = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      // Get all tracked nodes
      const nodeSnapshot = await db.collection('miner_nodes').get();
      
      for (const doc of nodeSnapshot.docs) {
        const node = doc.data();
        try {
          // Query node API for session data
          const sessionResponse = await axios.get(
            `http://localhost:8081/nodes/${node.nodeId}/session`
          );
          
          // Update node status
          await doc.ref.update({
            lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
            status: sessionResponse.data.status,
            clientVersion: sessionResponse.data.version
          });
          
          // Update metrics summary
          const summaryData = {
            entityType: "node",
            nodeId: node.nodeId,
            userId: node.userId,
            network: "testnet-1",
            uptimePct: sessionResponse.data.uptime_pct,
            blocksProposed: sessionResponse.data.blocks_proposed,
            blocksAccepted: sessionResponse.data.blocks_accepted,
            failedBlocks: sessionResponse.data.failed_blocks,
            corridorFailures: sessionResponse.data.corridor_failures,
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          const summaryId = `node-${node.nodeId}`;
          await db.collection('metrics_summary').doc(summaryId).set(summaryData);
        } catch (error) {
          console.error(`Error syncing session for ${node.nodeId}:`, error);
          
          // Mark node as offline if we can't reach it
          await doc.ref.update({
            status: "offline",
            lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error in syncNodeSessions:', error);
    }
  });