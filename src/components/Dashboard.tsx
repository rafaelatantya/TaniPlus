import { useCallback } from '@lynx-js/react';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard' | 'details', data?: any) => void;
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
        <view className="HeaderWelcomeArea">
          <view className="WelcomeAvatar" />
          <text className="WelcomeText">Halo Petani</text>
        </view>
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
          <view key={box.id} className="BoxItemCard" bindtap={() => onNavigate('details', box)}>
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

interface BoxDetailsProps {
  box: any;
  onBack: () => void;
}

export function BoxDetails({ box, onBack }: BoxDetailsProps) {
  const isBuruk = box.status === 'Perlu Perawatan' || box.status === 'Error';

  const metrics = [
    { id: 1, label: 'Kandungan Air', value: box.water, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 2, label: 'Kelembapan Tanah', value: box.sprout, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 3, label: 'Suhu Udara', value: box.temp, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 4, label: 'Curah Hujan', value: '22 mm', status: isBuruk ? 'Sedang' : 'Baik' },
    { id: 5, label: 'Umur Tanaman', value: '30 hst', status: isBuruk ? 'Sedang' : 'Baik' },
  ];

  return (
    <view className={`DetailsScreen ${isBuruk ? 'DetailsScreenBuruk' : 'DetailsScreenBaik'}`}>
      <view className="DetailsHeader">
        <view className="BackButton" bindtap={onBack}>
          <view className="BackArrowLine1" />
          <view className="BackArrowLine2" />
        </view>
        <text className="DetailsHeaderTitle">{box.name}</text>
        <view className="HeaderSpacer" />
      </view>

      <view className="DetailsHeroSection">
        <text className={`DetailsStatusTitle ${isBuruk ? 'TextBuruk' : 'TextBaik'}`}>
          {isBuruk ? 'Wilayah Buruk' : 'Wilayah Baik'}
        </text>
        <text className="DetailsStatusDesc">
          {isBuruk ? 'Kondisi tanaman dan tanah tidak bagus' : 'Kondisi tanaman dan tanah bagus'}
        </text>
      </view>

      <view className="MetricsList">
        {metrics.map((metric) => (
          <view key={metric.id} className="MetricRowCard">
            <view className="MetricLabelContainer">
              <text className="MetricRowLabel">{metric.label}</text>
            </view>
            <view className="MetricValueContainer">
              <text className="MetricRowValue">{metric.value}</text>
              <view className={`MetricRowTag ${metric.status === 'Baik' ? 'TagGreen' : metric.status === 'Sedang' ? 'TagOrange' : 'TagRed'}`}>
                <text className={`MetricRowTagText ${metric.status === 'Baik' ? 'TextGreen' : metric.status === 'Sedang' ? 'TextOrange' : 'TextRed'}`}>
                  {metric.status}
                </text>
              </view>
            </view>
          </view>
        ))}
      </view>

      <view className="DeviceInfoSection">
        <text className="DeviceSectionTitle">Informasi Perangkat</text>
        <view className="DeviceCard">
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">ID Perangkat</text>
            <text className="DeviceDetailValue">{box.status === 'Bagus' ? 'HT-001' : 'HT-002'}</text>
          </view>
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">Sinkronisasi Terakhir</text>
            <text className="DeviceDetailValue">2 menit lalu</text>
          </view>
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">Baterai</text>
            <text className="DeviceDetailValue">85%</text>
          </view>
        </view>
      </view>
    </view>
  );
}
