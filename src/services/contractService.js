import { Contract, formatEther, parseEther } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractInfo';

/**
 * Read-only contract (no signer needed)
 */
export const getReadContract = (provider) => {
  if (!provider) throw new Error('Provider is required');
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

/**
 * Write contract — must await getSigner() in ethers v6
 */
export const getWriteContract = async (provider) => {
  if (!provider) throw new Error('Provider is required');
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Create a new royalty
 */
export const createRoyalty = async (provider, creatorShare, platformShare) => {
  try {
    if (creatorShare + platformShare !== 100) {
      throw new Error('Creator share and platform share must equal 100%');
    }
    const contract = await getWriteContract(provider);
    const tx = await contract.createRoyalty(creatorShare, platformShare);
    return {
      hash: tx.hash,
      wait: async () => await tx.wait(),
    };
  } catch (error) {
    console.error('Create royalty error:', error);
    throw error;
  }
};

/**
 * Add revenue to a royalty (payable)
 */
export const addRevenue = async (provider, royaltyId, amountInEth) => {
  try {
    const contract = await getWriteContract(provider);
    const weiAmount = parseEther(amountInEth.toString());
    const tx = await contract.addRevenue(royaltyId, { value: weiAmount });
    return {
      hash: tx.hash,
      wait: async () => await tx.wait(),
    };
  } catch (error) {
    console.error('Add revenue error:', error);
    throw error;
  }
};

/**
 * Get royalty details
 */
export const getRoyalty = async (provider, royaltyId) => {
  try {
    const contract = getReadContract(provider);
    const royalty = await contract.getRoyalty(royaltyId);
    return {
      creator: royalty[0],
      totalRevenue: royalty[1],
      creatorShare: royalty[2],
      platformShare: royalty[3],
      active: royalty[4],
    };
  } catch (error) {
    console.error('Get royalty error:', error);
    throw error;
  }
};

/**
 * Distribute royalty revenue
 */
export const distributeRoyalty = async (provider, royaltyId) => {
  try {
    const contract = await getWriteContract(provider);
    const tx = await contract.distributeRoyalty(royaltyId);
    return {
      hash: tx.hash,
      wait: async () => await tx.wait(),
    };
  } catch (error) {
    console.error('Distribute royalty error:', error);
    throw error;
  }
};

/**
 * Get contract balance
 */
export const getContractBalance = async (provider) => {
  try {
    const contract = getReadContract(provider);
    const balance = await contract.getContractBalance();
    return formatEther(balance);
  } catch (error) {
    console.error('Get contract balance error:', error);
    throw error;
  }
};

/**
 * Get royalty count
 */
export const getRoyaltyCount = async (provider) => {
  try {
    const contract = getReadContract(provider);
    const count = await contract.royaltyCount();
    return Number(count);
  } catch (error) {
    console.error('Get royalty count error:', error);
    throw error;
  }
};

/**
 * Get contract owner
 */
export const getContractOwner = async (provider) => {
  try {
    const contract = getReadContract(provider);
    const owner = await contract.owner();
    return owner;
  } catch (error) {
    console.error('Get contract owner error:', error);
    throw error;
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Convert Wei to ETH
 */
export const weiToEth = (wei) => {
  if (!wei) return '0';
  try {
    return formatEther(wei);
  } catch {
    return '0';
  }
};
