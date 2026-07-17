import { useCallback } from '@lynx-js/react';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const handleLogout = useCallback(() => {
    onNavigate('login');
  }, [onNavigate]);

  const mockBoxes = [
    { id: 1, name: 'Box 1 - Lahan Tomat', status: 'Perlu Perawatan', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 2, name: 'Box 2 - Lahan Cabai', status: 'Perlu Perawatan', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 3, name: 'Box 3 - Lahan Bawang', status: 'Bagus', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 4, name: 'Box 4 - Lahan Kentang', status: 'Bagus', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 5, name: 'Box 5 - Lahan Melon', status: 'Error', water: 'Error', sprout: 'Error', temp: 'Error' },
  ];

  return (
    <view className="DashboardScreen">
      <view className="DashboardHeader">
        <text className="WelcomeText">Halo Petani</text>
        <view className="LogoutBtn" bindtap={handleLogout}>
          <text className="LogoutText">Logout</text>
        </view>
      </view>

      <view className="RecommendationBanner">
        <view className="IconWrapper">
          <view className="LightBulbIcon">
            <view className="BulbCircle" />
            <view className="BulbBase" />
          </view>
        </view>
        <view className="BannerTextContainer">
          <text className="BannerTitle">Rekomendasi Pintar</text>
          <text className="BannerBody">Box 2 perlu diperhatikan!!</text>
        </view>
      </view>

      <view className="StatsGrid">
        <view className="StatsRow">
          <view className="StatCard CardGreen">
            <view className="StatIconContainer">
              <view className="CheckIcon">
                <view className="CheckLine1" />
                <view className="CheckLine2" />
              </view>
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorGreenText">2</text>
              <text className="StatLabel ColorGreenText">Wilayah Bagus</text>
            </view>
          </view>

          <view className="StatCard CardOrange">
            <view className="StatIconContainer">
              <view className="TriangleIcon">
                <view className="TriangleExclamation" />
              </view>
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorOrangeText">2</text>
              <text className="StatLabel ColorOrangeText">Butuh Perawatan</text>
            </view>
          </view>
        </view>

        <view className="StatCardFull CardGrey">
          <view className="StatIconContainer">
            <view className="RssIcon">
              <view className="RssDot" />
              <view className="RssRing1" />
              <view className="RssRing2" />
            </view>
          </view>
          <view className="StatTextContainer">
            <text className="StatNumber ColorGreyText">1</text>
            <text className="StatLabel ColorGreyText">Box Error</text>
          </view>
        </view>
      </view>

      <view className="SectionTitleContainer">
        <text className="SectionTitle">Daftar Box</text>
      </view>

      <scroll-view className="BoxListContainer" scroll-y={true}>
        {mockBoxes.map((box) => (
          <view key={box.id} className="BoxItemCard">
            <view className="BoxItemHeader">
              <view className="BoxItemInfo">
                <view className="PlantIcon">
                  <view className="PlantStem" />
                  <view className="PlantLeafLeft" />
                  <view className="PlantLeafRight" />
                </view>
                <view className="BoxNameAndStatus">
                  <text className="BoxItemName">{box.name}</text>
                  <view className="BoxStatusContainer">
                    <view className={`BoxStatusDot Dot${box.status.replace(/\s+/g, '')}`} />
                    <text className={`BoxStatusText Text${box.status.replace(/\s+/g, '')}`}>
                      {box.status}
                    </text>
                  </view>
                </view>
              </view>
              <view className="ArrowIcon">
                <view className="ArrowLine1" />
                <view className="ArrowLine2" />
              </view>
            </view>

            <view className="BoxSensorsRow">
              <view className="SensorCol">
                <view className="SensorIconContainer WaterBg">
                  <view className="WaterDropIcon" />
                </view>
                <text className="SensorValue">{box.water}</text>
              </view>
              <view className="SensorCol">
                <view className="SensorIconContainer SproutBg">
                  <view className="SproutIcon">
                    <view className="SproutStem" />
                    <view className="SproutLeafLeft" />
                    <view className="SproutLeafRight" />
                  </view>
                </view>
                <text className="SensorValue">{box.sprout}</text>
              </view>
              <view className="SensorCol">
                <view className="SensorIconContainer TempBg">
                  <view className="TempIcon">
                    <view className="TempBulb" />
                    <view className="TempCircle" />
                  </view>
                </view>
                <text className="SensorValue">{box.temp}</text>
              </view>
            </view>
          </view>
        ))}
      </scroll-view>
    </view>
  );
}
