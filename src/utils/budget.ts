import { Advertisement } from '@/types/advertisement';

// 광고 비용 계산 (CPC 모델)
export const calculateAdCost = (clicks: number, cpc: number = 1000): number => {
  return clicks * cpc;
};

// 예산 소진 여부 확인
export const isBudgetExhausted = (ad: any): boolean => {
  const spent = ad.spent || 0;
  const budget = ad.budget || 0;
  return budget > 0 && spent >= budget;
};

// 예산 잔액 계산
export const getBudgetBalance = (ad: Advertisement): number => {
  const spent = ad.spent || 0;
  const budget = ad.budget || 0;
  return Math.max(0, budget - spent);
};

// 예산 소진률 계산
export const getBudgetExhaustionRate = (ad: Advertisement): number => {
  const spent = ad.spent || 0;
  const budget = ad.budget || 0;
  
  if (budget === 0) return 0;
  return Math.min(100, (spent / budget) * 100);
};

// 예산 상태 확인
export const getBudgetStatus = (ad: Advertisement): {
  status: 'active' | 'warning' | 'exhausted' | 'no-budget';
  message: string;
  percentage: number;
} => {
  const spent = ad.spent || 0;
  const budget = ad.budget || 0;
  
  if (budget === 0) {
    return {
      status: 'no-budget',
      message: '예산이 설정되지 않음',
      percentage: 0
    };
  }
  
  const percentage = (spent / budget) * 100;
  
  if (percentage >= 100) {
    return {
      status: 'exhausted',
      message: '예산 소진',
      percentage: 100
    };
  } else if (percentage >= 80) {
    return {
      status: 'warning',
      message: '예산 소진 임박',
      percentage
    };
  } else {
    return {
      status: 'active',
      message: '정상',
      percentage
    };
  }
};

// 광고 활성화 여부 확인 (예산 + 기간)
export const isAdActive = (ad: Advertisement): boolean => {
  if (!ad.isActive) return false;
  
  const now = new Date();
  const startDate = new Date(ad.startDate);
  const endDate = new Date(ad.endDate);
  
  // 기간 확인
  if (now < startDate || now > endDate) return false;
  
  // 예산 확인
  if (isBudgetExhausted(ad)) return false;
  
  return true;
};

// 예산 알림 메시지 생성
export const getBudgetAlertMessage = (ad: Advertisement): string | null => {
  const status = getBudgetStatus(ad);
  
  switch (status.status) {
    case 'exhausted':
      return '광고 예산이 소진되어 광고가 중지되었습니다.';
    case 'warning':
      return `광고 예산의 ${status.percentage.toFixed(1)}%가 소진되었습니다.`;
    default:
      return null;
  }
}; 