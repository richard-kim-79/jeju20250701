'use client';

import { useState, useEffect } from 'react';
import { Advertisement, AdCategory } from '@/types/advertisement';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { AdvertisementForm } from '@/components/AdvertisementForm';
import { AdvertisementDashboard } from '@/components/AdvertisementDashboard';
import { PlusIcon, ChartBarIcon, CogIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | ''>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [selectedCategory]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`/api/ads?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setAds(data.ads || []);
      } else {
        console.error('광고 목록 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('광고 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImpression = async (adId: string) => {
    // 관리자 페이지에서는 노출 추적하지 않음
  };

  const handleClick = async (adId: string) => {
    // 관리자 페이지에서는 클릭 추적하지 않음
  };

  const handleCreateAd = () => {
    setEditingAd(null);
    setShowForm(true);
  };

  const handleEditAd = (ad: Advertisement) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('정말로 이 광고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // 목록에서 제거
        setAds(prev => prev.filter(ad => ad.id !== adId));
        alert('광고가 삭제되었습니다.');
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('광고 삭제 실패:', error);
      alert('광고 삭제에 실패했습니다.');
    }
  };

  const handleSubmitAd = async (data: Partial<Advertisement>) => {
    try {
      const url = editingAd ? `/api/ads/${editingAd.id}` : '/api/ads';
      const method = editingAd ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          advertiserId: 'temp-advertiser-id' // 임시 광고주 ID
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingAd) {
          // 수정된 광고 업데이트
          setAds(prev => prev.map(ad => 
            ad.id === editingAd.id ? { ...ad, ...result } : ad
          ));
          alert('광고가 수정되었습니다.');
        } else {
          // 새 광고 추가
          setAds(prev => [result, ...prev]);
          alert('광고가 등록되었습니다.');
        }
        
        setShowForm(false);
        setEditingAd(null);
      } else {
        const errorData = await response.json();
        alert(`저장 실패: ${errorData.error}`);
      }
    } catch (error) {
      console.error('광고 저장 실패:', error);
      alert('광고 저장에 실패했습니다.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAd(null);
  };

  const categoryLabels: Record<AdCategory, string> = {
    [AdCategory.RESTAURANT]: '맛집',
    [AdCategory.ACCOMMODATION]: '숙박',
    [AdCategory.ACTIVITY]: '액티비티',
    [AdCategory.TRANSPORT]: '교통',
    [AdCategory.SHOPPING]: '쇼핑',
    [AdCategory.CULTURE]: '문화',
    [AdCategory.NATURE]: '자연',
    [AdCategory.OTHER]: '기타'
  };

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">광고 관리</h1>
          <p className="mt-2 text-gray-600">제주 SNS 광고 시스템을 관리합니다.</p>
        </div>

        {/* 통계 대시보드 */}
        <div className="mb-8">
          <AdvertisementDashboard ads={ads} />
        </div>

        {/* 필터 및 액션 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as AdCategory | '')}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">전체 카테고리</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateAd}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  새 광고 등록
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 광고 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              광고 목록 ({ads.length}개)
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">광고를 불러오는 중...</p>
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>등록된 광고가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ads.map((ad) => (
                  <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
                    <AdvertisementCard
                      ad={ad}
                      onImpression={handleImpression}
                      onClick={handleClick}
                      variant="feed"
                    />
                    
                    {/* 관리자 액션 */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p>노출: {ad.impressions.toLocaleString()} | 클릭: {ad.clicks.toLocaleString()}</p>
                        <p>CTR: {ad.ctr.toFixed(2)}% | 예산: {ad.budget.toLocaleString()}원</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditAd(ad)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteAd(ad.id)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 등록/수정 폼 */}
      {showForm && (
        <AdvertisementForm
          ad={editingAd || undefined}
          onSubmit={handleSubmitAd}
          onCancel={handleCancelForm}
          isEditing={!!editingAd}
        />
      )}
    </div>
  );
} 