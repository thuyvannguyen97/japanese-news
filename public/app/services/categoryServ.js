var categor = angular.module('mazii.service.category', []);

categor.factory('categoryServ', ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", 
	function($rootScope, $q, $http, $timeout, $stateParams, $state) {
 		
	var service = {};

  var altCategoryDict = [
      {
        "id": -1,
        "jp_name": "None",
        "en_name": "None",
        "vi_name" : "Không thuộc category nào!"
      },
      {
        "id": 1,
        "jp_name" : "名前_その他",
        "en_name" : "Name_Other",
        "vi_name" : "Tên (nói chung)"
      },
      {
        "id": 2,
        "jp_name": "人名",
        "en_name": "Person",
        "vi_name" : "Tên người"
      },
      {
        "id": 3,
        "jp_name": "神名",
        "en_name": "God",
        "vi_name" : "Thánh thần"
      },
      {
        "id": 4,
        "jp_name": "組織名_その他",
        "en_name": "Organization_Other",
        "vi_name" : "Tên tổ chức (nói chung)"
      },
      {
        "id": 5,
        "jp_name": "国際組織名",
        "en_name": "International_Organization",
        "vi_name" : "Tổ chức quốc tế"
      },
      {
        "id": 6,
        "jp_name": "公演組織名",
        "en_name": "Show_Organization",
        "vi_name" : "Đoàn nghệ thuật"
      },
      {
        "id": 7,
        "jp_name": "家系名",
        "en_name": "Family",
        "vi_name" : "Gia tộc"
      },
      {
        "id": 8,
        "jp_name": "民族名_その他",
        "en_name": "Ethnic_Group_Other",
        "vi_name" : "Dân tộc"
      },
      {
        "id": 9,
        "jp_name": "国籍名",
        "en_name": "Nationality",
        "vi_name" : "Quốc tịch"
      },
      {
        "id": 10,
        "jp_name": "競技組織名_その他",
        "en_name": "Sports_Organization_Other",
        "vi_name" : "Đội thể thao"
      },
      {
        "id": 11,
        "jp_name": "プロ競技組織名",
        "en_name": "Pro_Sports_Organization",
        "vi_name" : "Đội thể thao chuyên nghiệp"
      },
      {
        "id": 12,
        "jp_name": "競技リーグ名",
        "en_name": "Sports_League",
        "vi_name" : "Giải đấu thể thao"
      },
      {
        "id": 13,
        "jp_name": "法人名_その他",
        "en_name": "Corporation_Other",
        "vi_name" : "Pháp nhân"
      },
      {
        "id": 14,
        "jp_name": "企業名",
        "en_name": "Company",
        "vi_name" : "Công ty"
      },
      {
        "id": 15,
        "jp_name": "企業グループ名",
        "en_name": "Company_Group",
        "vi_name" : "Tập đoàn"
      },
      {
        "id": 16,
        "jp_name": "政治的組織名_その他",
        "en_name": "Political_Organization_Other",
        "vi_name" : "Tổ chức chính trị"
      },
      {
        "id": 17,
        "jp_name": "政府組織名",
        "en_name": "Government",
        "vi_name" : "Tổ chức chính phủ"
      },
      {
        "id": 18,
        "jp_name": "政党名",
        "en_name": "Political_Party",
        "vi_name" : "Chính đảng"
      },
      {
        "id": 19,
        "jp_name": "内閣名",
        "en_name": "Cabinet",
        "vi_name" : "Chính đảng"
      },
      {
        "id": 20,
        "jp_name": "軍隊名",
        "en_name": "Military",
        "vi_name" : "Quân đội"
      },
      {
        "id": 21,
        "jp_name": "地名_その他",
        "en_name": "Location_Other",
        "vi_name" : "Địa danh"
      },
      {
        "id": 22,
        "jp_name": "温泉名",
        "en_name": "Spa",
        "vi_name" : "Suối nước nóng"
      },
      {
        "id": 23,
        "jp_name": "GPE_その他",
        "en_name": "GPE_Other",
        "vi_name" : "Thực thể địa chính"
      },
      {
        "id": 24,
        "jp_name": "市区町村名",
        "en_name": "City",
        "vi_name" : "Quận huyện"
      },
      {
        "id": 25,
        "jp_name": "郡名",
        "en_name": "County",
        "vi_name" : "Làng"
      },
      {
        "id": 26,
        "jp_name": "都道府県州名",
        "en_name": "Province",
        "vi_name" : "Tỉnh thành"
      },
      {
        "id": 27,
        "jp_name": "国名",
        "en_name": "Country",
        "vi_name" : "Đất nước"
      },
      {
        "id": 28,
        "jp_name": "地域名_その他",
        "en_name": "Region_Other",
        "vi_name" : "Vùng miền"
      },
      {
        "id": 29,
        "jp_name": "大陸地域名",
        "en_name": "Continental_Region",
        "vi_name" : "Châu lục"
      },
      {
        "id": 30,
        "jp_name": "国内地域名",
        "en_name": "Domestic_Region",
        "vi_name" : "Vùng địa phương"
      },
      {
        "id": 31,
        "jp_name": "地形名_その他",
        "en_name": "Geological_Region_Other",
        "vi_name" : "Địa hình"
      },
      {
        "id": 32,
        "jp_name": "山地名",
        "en_name": "Mountain",
        "vi_name" : "Núi"
      },
      {
        "id": 33,
        "jp_name": "島名",
        "en_name": "Island",
        "vi_name" : "Đảo"
      },
      {
        "id": 34,
        "jp_name": "河川名",
        "en_name": "River",
        "vi_name" : "Sông ngòi"
      },
      {
        "id": 35,
        "jp_name": "湖沼名",
        "en_name": "Lake",
        "vi_name" : "Hồ"
      },
      {
        "id": 36,
        "jp_name": "海洋名",
        "en_name": "Sea",
        "vi_name" : "Biển"
      },
      {
        "id": 37,
        "jp_name": "湾名",
        "en_name": "Bay",
        "vi_name" : "Vịnh"
      },
      {
        "id": 38,
        "jp_name": "天体名_その他",
        "en_name": "Astral_Body_Other",
        "vi_name" : "Thiên thể"
      },
      {
        "id": 39,
        "jp_name": "恒星名",
        "en_name": "Star",
        "vi_name" : "Mặt trời (Sao)"
      },
      {
        "id": 40,
        "jp_name": "惑星名",
        "en_name": "Planet",
        "vi_name" : "Hành tinh"
      },
      {
        "id": 41,
        "jp_name": "星座名",
        "en_name": "Constellation",
        "vi_name" : "Chòm sao"
      },
      {
        "id": 42,
        "jp_name": "アドレス_その他",
        "en_name": "Address_Other",
        "vi_name" : "Địa chỉ"
      },
      {
        "id": 43,
        "jp_name": "郵便住所",
        "en_name": "Postal_Address",
        "vi_name" : "Địa chỉ bưu điện"
      },
      {
        "id": 44,
        "jp_name": "電話番号",
        "en_name": "Phone_Number",
        "vi_name" : "Số điện thoại"
      },
      {
        "id": 45,
        "jp_name": "電子メイル",
        "en_name": "Email",
        "vi_name" : "Địa chỉ email"
      },
      {
        "id": 46,
        "jp_name": "URL",
        "en_name": "URL",
        "vi_name" : "URL"
      },
      {
        "id": 47,
        "jp_name": "施設名_その他",
        "en_name": "Facility_Other",
        "vi_name" : "Kiến trúc"
      },
      {
        "id": 48,
        "jp_name": "施設部分名",
        "en_name": "Facility_Part",
        "vi_name" : "Bộ phận của kiến trúc"
      },
      {
        "id": 49,
        "jp_name": "遺跡名_その他",
        "en_name": "Archaeological_Place_Other",
        "vi_name" : "Di tích"
      },
      {
        "id": 50,
        "jp_name": "古墳名",
        "en_name": "Tumulus",
        "vi_name" : "Mộ cổ"
      },
      {
        "id": 51,
        "jp_name": "GOE_その他",
        "en_name": "GOE_Other",
        "vi_name" : "Thực thể hành chính"
      },
      {
        "id": 52,
        "jp_name": "公共機関名",
        "en_name": "Public_Institution",
        "vi_name" : "Cơ quan công cộng"
      },
      {
        "id": 53,
        "jp_name": "学校名",
        "en_name": "School",
        "vi_name" : "Trường học"
      },
      {
        "id": 54,
        "jp_name": "研究機関名",
        "en_name": "Research_Institute",
        "vi_name" : "Viện nghiên cứu"
      },
      {
        "id": 55,
        "jp_name": "取引所名",
        "en_name": "Market",
        "vi_name" : "Sở giao dịch, chợ"
      },
      {
        "id": 56,
        "jp_name": "公園名",
        "en_name": "Park",
        "vi_name" : "Công viên"
      },
      {
        "id": 57,
        "jp_name": "競技施設名",
        "en_name": "Sports_Facility",
        "vi_name" : "Nơi thi đấu thể thao"
      },
      {
        "id": 58,
        "jp_name": "美術博物館名",
        "en_name": "Museum",
        "vi_name" : "Bảo tàng"
      },
      {
        "id": 59,
        "jp_name": "動植物園名",
        "en_name": "Zoo",
        "vi_name" : "Sở thú, vườn cây"
      },
      {
        "id": 60,
        "jp_name": "遊園施設名",
        "en_name": "Amusement_Park",
        "vi_name" : "Công viên giải trí"
      },
      {
        "id": 61,
        "jp_name": "劇場名",
        "en_name": "Theater",
        "vi_name" : "Nhà hát"
      },
      {
        "id": 62,
        "jp_name": "神社寺名",
        "en_name": "Worship_Place",
        "vi_name" : "Nơi thờ cúng"
      },
      {
        "id": 63,
        "jp_name": "停車場名",
        "en_name": "Car_Stop",
        "vi_name" : "Bến xe"
      },
      {
        "id": 64,
        "jp_name": "電車駅名",
        "en_name": "Station",
        "vi_name" : "Ga tàu"
      },
      {
        "id": 65,
        "jp_name": "空港名",
        "en_name": "Airport",
        "vi_name" : "Sân bay"
      },
      {
        "id": 66,
        "jp_name": "港名",
        "en_name": "Port",
        "vi_name" : "Cảng"
      },
      {
        "id": 67,
        "jp_name": "路線名_その他",
        "en_name": "Line_Other",
        "vi_name" : "Tuyến đường"
      },
      {
        "id": 68,
        "jp_name": "電車路線名",
        "en_name": "Railroad",
        "vi_name" : "Đường sắt"
      },
      {
        "id": 69,
        "jp_name": "道路名",
        "en_name": "Road",
        "vi_name" : "Đường bộ"
      },
      {
        "id": 70,
        "jp_name": "運河名",
        "en_name": "Canal",
        "vi_name" : "Kênh đào"
      },
      {
        "id": 71,
        "jp_name": "航路名",
        "en_name": "Water_Route",
        "vi_name" : "Đường thuỷ"
      },
      {
        "id": 72,
        "jp_name": "トンネル名",
        "en_name": "Tunnel",
        "vi_name" : "Hầm đường bộ"
      },
      {
        "id": 73,
        "jp_name": "橋名",
        "en_name": "Bridge",
        "vi_name" : "Cầu"
      },
      {
        "id": 74,
        "jp_name": "製品名_その他",
        "en_name": "Product_Other",
        "vi_name" : "Sản phẩm"
      },
      {
        "id": 75,
        "jp_name": "材料名",
        "en_name": "Material",
        "vi_name" : "Chất liệu"
      },
      {
        "id": 76,
        "jp_name": "衣類名",
        "en_name": "Clothing",
        "vi_name" : "Quần áo"
      },
      {
        "id": 77,
        "jp_name": "貨幣名",
        "en_name": "Money_Form",
        "vi_name" : "Tiền tệ"
      },
      {
        "id": 78,
        "jp_name": "医薬品名",
        "en_name": "Drug",
        "vi_name" : "Thuốc men"
      },
      {
        "id": 79,
        "jp_name": "武器名",
        "en_name": "Weapon",
        "vi_name" : "Vũ khí"
      },
      {
        "id": 80,
        "jp_name": "株名",
        "en_name": "Stock",
        "vi_name" : "Cổ phiếu"
      },
      {
        "id": 81,
        "jp_name": "賞名",
        "en_name": "Award",
        "vi_name" : "Giải thưởng"
      },
      {
        "id": 82,
        "jp_name": "勲章名",
        "en_name": "Decoration",
        "vi_name" : "Huân huy chương"
      },
      {
        "id": 83,
        "jp_name": "罪名",
        "en_name": "Offense",
        "vi_name" : "Tội phạm"
      },
      {
        "id": 84,
        "jp_name": "便名",
        "en_name": "Service",
        "vi_name" : "Tên chuyến (tàu, xe, máy bay)"
      },
      {
        "id": 85,
        "jp_name": "等級名",
        "en_name": "Class",
        "vi_name" : "Tên đẳng cấp"
      },
      {
        "id": 86,
        "jp_name": "キャラクター名",
        "en_name": "Character",
        "vi_name" : "Nhân vật"
      },
      {
        "id": 87,
        "jp_name": "識別番号",
        "en_name": "ID_Number",
        "vi_name" : "Nhân vật"
      },
      {
        "id": 88,
        "jp_name": "乗り物名_その他",
        "en_name": "Vehicle_Other",
        "vi_name" : "Nhân vật"
      },
      {
        "id": 89,
        "jp_name": "車名",
        "en_name": "Car",
        "vi_name" : "Nhân vật"
      },
      {
        "id": 90,
        "jp_name": "列車名",
        "en_name": "Train",
        "vi_name" : "Đoàn tàu"
      },
      {
        "id": 91,
        "jp_name": "飛行機名",
        "en_name": "Aircraft",
        "vi_name" : "Máy bay"
      },
      {
        "id": 92,
        "jp_name": "宇宙船名",
        "en_name": "Spaceship",
        "vi_name" : "Tàu vũ trụ"
      },
      {
        "id": 93,
        "jp_name": "船名",
        "en_name": "Ship",
        "vi_name" : "Tàu thuyền"
      },
      {
        "id": 94,
        "jp_name": "食べ物名_その他",
        "en_name": "Food_Other",
        "vi_name" : "Thức ăn"
      },
      {
        "id": 95,
        "jp_name": "料理名",
        "en_name": "Dish",
        "vi_name" : "Món ăn"
      },
      {
        "id": 96,
        "jp_name": "芸術作品名_その他",
        "en_name": "Art_Other",
        "vi_name" : "Tác phẩm nghệ thuật"
      },
      {
        "id": 97,
        "jp_name": "絵画名",
        "en_name": "Picture",
        "vi_name" : "Tranh ảnh"
      },
      {
        "id": 98,
        "jp_name": "番組名",
        "en_name": "Broadcast_Program",
        "vi_name" : "Chương trình phát thanh, phát hình"
      },
      {
        "id": 99,
        "jp_name": "映画名",
        "en_name": "Movie",
        "vi_name" : "Phim ảnh"
      },
      {
        "id": 100,
        "jp_name": "公演名",
        "en_name": "Show",
        "vi_name" : "Buổi biểu diễn"
      },
      {
        "id": 101,
        "jp_name": "音楽名",
        "en_name": "Music",
        "vi_name" : "Tên bài hát, nhạc"
      },
      {
        "id": 102,
        "jp_name": "文学名",
        "en_name": "Book",
        "vi_name" : "Tên sách"
      },
      {
        "id": 103,
        "jp_name": "出版物名_その他",
        "en_name": "Printing_Other",
        "vi_name" : "Ấn phẩm"
      },
      {
        "id": 104,
        "jp_name": "新聞名",
        "en_name": "Newspaper",
        "vi_name" : "Báo chí"
      },
      {
        "id": 105,
        "jp_name": "雑誌名",
        "en_name": "Magazine",
        "vi_name" : "Tạp chí"
      },
      {
        "id": 106,
        "jp_name": "主義方式名_その他",
        "en_name": "Doctrine_Method_Other",
        "vi_name" : "Văn hoá - Tư tưởng - Chủ nghĩa"
      },
      {
        "id": 107,
        "jp_name": "文化名",
        "en_name": "Culture",
        "vi_name" : "Văn hoá"
      },
      {
        "id": 108,
        "jp_name": "宗教名",
        "en_name": "Religion",
        "vi_name" : "Tôn giáo"
      },
      {
        "id": 109,
        "jp_name": "学問名",
        "en_name": "Academic",
        "vi_name" : "Môn học"
      },
      {
        "id": 110,
        "jp_name": "競技名",
        "en_name": "Sport",
        "vi_name" : "Môn thể thao"
      },
      {
        "id": 111,
        "jp_name": "流派名",
        "en_name": "Style",
        "vi_name" : "Trường phái"
      },
      {
        "id": 112,
        "jp_name": "運動名",
        "en_name": "Movement",
        "vi_name" : "Phong trào"
      },
      {
        "id": 113,
        "jp_name": "理論名",
        "en_name": "Theory",
        "vi_name" : "Lý thuyết"
      },
      {
        "id": 114,
        "jp_name": "政策計画名",
        "en_name": "Plan",
       "vi_name" :  "Kế hoạch, chính sách"
      },
      {
        "id": 115,
        "jp_name": "規則名_その他",
        "en_name": "Rule_Other",
        "vi_name" : "Luật, quyết định, quyết nghị"
      },
      {
        "id": 116,
        "jp_name": "条約名",
        "en_name": "Treaty",
        "vi_name" : "Điều ước"
      },
      {
        "id": 117,
        "jp_name": "法令名",
        "en_name": "Law",
        "vi_name" : "Luật, pháp lệnh"
      },
      {
        "id": 118,
        "jp_name": "称号名_その他",
        "en_name": "Title_Other",
        "vi_name" : "Danh xưng"
      },
      {
        "id": 119,
        "jp_name": "地位職業名",
        "en_name": "Position_Vocation",
        "vi_name" : "Địa vị"
      },
      {
        "id": 120,
        "jp_name": "言語名_その他",
        "en_name": "Language_Other",
        "vi_name" : "Ngôn ngữ, tiếng nói"
      },
      {
        "id": 121,
        "jp_name": "国語名",
        "en_name": "National_Language",
        "vi_name" : "Ngôn ngữ"
      },
      {
        "id": 122,
        "jp_name": "単位名_その他",
        "en_name": "Unit_Other",
        "vi_name" : "Đơn vị đo"
      },
      {
        "id": 123,
        "jp_name": "通貨単位名",
        "en_name": "Currency",
        "vi_name" : "Đơn vị tiền tệ"
      },
      {
        "id": 124,
        "jp_name": "イベント名_その他",
        "en_name": "Event_Other",
        "vi_name" : "Sự kiện - Hiện tượng"
      },
      {
        "id": 125,
        "jp_name": "催し物名_その他",
        "en_name": "Occasion_Other",
        "vi_name" : "Sự kiện"
      },
      {
        "id": 126,
        "jp_name": "例祭名",
        "en_name": "Religious_Festival",
        "vi_name" : "Lễ hội"
      },
      {
        "id": 127,
        "jp_name": "競技会名",
        "en_name": "Game",
        "vi_name" : "Trận đấu"
      },
      {
        "id": 128,
        "jp_name": "会議名",
        "en_name": "Conference",
        "vi_name" : "Hội nghị, hội thảo"
      },
      {
        "id": 129,
        "jp_name": "事故事件名_その他",
        "en_name": "Incident_Other",
        "vi_name" : "Tai nạn"
      },
      {
        "id": 130,
        "jp_name": "戦争名",
        "en_name": "War",
        "vi_name" : "Chiến tranh"
      },
      {
        "id": 131,
        "jp_name": "自然現象名_その他",
        "en_name": "Natural_Phenomenon_Other",
        "vi_name" : "Hiện tượng tự nhiên"
      },
      {
        "id": 132,
        "jp_name": "自然災害名",
        "en_name": "Natural_Disaster",
        "vi_name" : "Thiên tai"
      },
      {
        "id": 133,
        "jp_name": "地震名",
        "en_name": "Earthquake",
        "vi_name" : "Động đất"
      },
      {
        "id": 134,
        "jp_name": "自然物名_その他",
        "en_name": "Natural_Object_Other",
        "vi_name" : "Vật chất tự nhiên"
      },
      {
        "id": 135,
        "jp_name": "元素名",
        "en_name": "Element",
        "vi_name" : "Nguyên tố"
      },
      {
        "id": 136,
        "jp_name": "化合物名",
        "en_name": "Compound",
        "vi_name" : "Hợp chất"
      },
      {
        "id": 137,
        "jp_name": "鉱物名",
        "en_name": "Mineral",
        "vi_name" : "Khoáng sản"
      },
      {
        "id": 138,
        "jp_name": "生物名_その他",
        "en_name": "Living_Thing_Other",
        "vi_name" : "Sinh vật"
      },
      {
        "id": 139,
        "jp_name": "真菌類名",
        "en_name": "Fungus",
        "vi_name" : "Nấm"
      },
      {
        "id": 140,
        "jp_name": "軟体動物_節足動物名",
        "en_name": "Mollusk_Arthropod",
        "vi_name" : "Động vật thân mềm, chân khớp"
      },
      {
        "id": 141,
        "jp_name": "昆虫類名",
        "en_name": "Insect",
        "vi_name" : "Côn trùng"
      },
      {
        "id": 142,
        "jp_name": "魚類名",
        "en_name": "Fish",
        "vi_name" : "Cá"
      },
      {
        "id": 143,
        "jp_name": "両生類名",
        "en_name": "Amphibia",
        "vi_name" : "Động vật lưỡng sinh"
      },
      {
        "id": 144,
        "jp_name": "爬虫類名",
        "en_name": "Reptile",
        "vi_name" : "Bò sát"
      },
      {
        "id": 145,
        "jp_name": "鳥類名",
        "en_name": "Bird",
        "vi_name" : "Chim"
      },
      {
        "id": 146,
        "jp_name": "哺乳類名",
        "en_name": "Mammal",
        "vi_name" : "Động vật có vú (thú)"
      },
      {
        "id": 147,
        "jp_name": "植物名",
        "en_name": "Flora",
        "vi_name" : "Thực vật"
      },
      {
        "id": 148,
        "jp_name": "生物部位名_その他",
        "en_name": "Living_Thing_Part_Other",
        "vi_name" : "Cấu trúc của sự sống"
      },
      {
        "id": 149,
        "jp_name": "動物部位名",
        "en_name": "Animal_Part",
        "vi_name" : "Bộ phận cơ thể"
      },
      {
        "id": 150,
        "jp_name": "植物部位名",
        "en_name": "Flora_Part",
        "vi_name" : "Bộ phận của sinh vật"
      },
      {
        "id": 151,
        "jp_name": "病気名_その他",
        "en_name": "Disease_Other",
        "vi_name" : "Bệnh tật"
      },
      {
        "id": 152,
        "jp_name": "動物病気名",
        "en_name": "Animal_Disease",
        "vi_name" : "Bệnh động vật"
      },
      {
        "id": 153,
        "jp_name": "色名_その他",
        "en_name": "Color_Other",
        "vi_name" : "Màu sắc"
      },
      {
        "id": 154,
        "jp_name": "自然色名",
        "en_name": "Nature_Color",
        "vi_name" : "Màu tự nhiên"
      },
      {
        "id": 155,
        "jp_name": "時間表現_その他",
        "en_name": "Time_Top_Other",
        "vi_name" : "Thời gian - thời điểm"
      },
      {
        "id": 156,
        "jp_name": "時間_その他",
        "en_name": "Timex_Other",
        "vi_name" : "Thời điểm"
      },
      {
        "id": 157,
        "jp_name": "時刻表現",
        "en_name": "Time",
        "vi_name" : "Thời gian - thời khắc"
      },
      {
        "id": 158,
        "jp_name": "日付表現",
        "en_name": "Date",
        "vi_name" : "Ngày tháng"
      },
      {
        "id": 159,
        "jp_name": "曜日表現",
        "en_name": "Day_Of_Week",
        "vi_name" : "Ngày trong tuần",
      },
      {
        "id": 160,
        "jp_name": "時代表現",
        "en_name": "Era",
        "vi_name" : "Thời đại"
      },
      {
        "id": 161,
        "jp_name": "期間_その他",
        "en_name": "Periodx_Other",
        "vi_name" : "Thời kỳ"
      },
      {
        "id": 162,
        "jp_name": "時刻期間",
        "en_name": "Period_Time",
        "vi_name" : "Số thời gian"
      },
      {
        "id": 163,
        "jp_name": "日数期間",
        "en_name": "Period_Day",
        "vi_name" : "Số ngày"
      },
      {
        "id": 164,
        "jp_name": "週数期間",
        "en_name": "Period_Week",
        "vi_name" : "Số tuần"
      },
      {
        "id": 165,
        "jp_name": "月数期間",
        "en_name": "Period_Month",
        "vi_name" : "Số tháng"
      },
      {
        "id": 166,
        "jp_name": "年数期間",
        "en_name": "Period_Year",
        "vi_name" : "Số năm"
      },
      {
        "id": 167,
        "jp_name": "数値表現_その他",
        "en_name": "Numex_Other",
        "vi_name" : "Số liệu"
      },
      {
        "id": 168,
        "jp_name": "金額表現",
        "en_name": "Money",
        "vi_name" : "Số tiền"
      },
      {
        "id": 169,
        "jp_name": "株指標",
        "en_name": "Stock_Index",
        "vi_name" : "Chỉ số chứng khoán"
      },
      {
        "id": 170,
        "jp_name": "ポイント",
        "en_name": "Point",
        "vi_name" : "Điểm số"
      },
      {
        "id": 171,
        "jp_name": "割合表現",
        "en_name": "Percent",
        "vi_name" : "Số phần trăm"
      },
      {
        "id": 172,
        "jp_name": "倍数表現",
        "en_name": "Multiplication",
        "vi_name" : "Bội số"
      },
      {
        "id": 173,
        "jp_name": "頻度表現",
        "en_name": "Frequency",
        "vi_name" : "Tần số"
      },
      {
        "id": 174,
        "jp_name": "年齢",
        "en_name": "Age",
        "vi_name" : "Tuổi tác"
      },
      {
        "id": 175,
        "jp_name": "学齢",
        "en_name": "School_Age",
        "vi_name" : "Tuổi năm học"
      },
      {
        "id": 176,
        "jp_name": "序数",
        "en_name": "Ordinal_Number",
        "vi_name" : "Số thứ tự"
      },
      {
        "id": 177,
        "jp_name": "順位表現",
        "en_name": "Rank",
        "vi_name" : "Thứ hạng"
      },
      {
        "id": 178,
        "jp_name": "緯度経度",
        "en_name": "Latitude_Longitude",
        "vi_name" : "Kinh độ, vĩ độ"
      },
      {
        "id": 179,
        "jp_name": "寸法表現_その他",
        "en_name": "Measurement_Other",
        "vi_name" : "Đo lường"
      },
      {
        "id": 180,
        "jp_name": "長さ",
        "en_name": "Physical_Extent",
        "vi_name" : "Chiều dài"
      },
      {
        "id": 181,
        "jp_name": "面積",
        "en_name": "Space",
        "vi_name" : "Diện tích"
      },
      {
        "id": 182,
        "jp_name": "体積",
        "en_name": "Volume",
        "vi_name" : "Thể tích"
      },
      {
        "id": 183,
        "jp_name": "重量",
        "en_name": "Weight",
        "vi_name" : "Trọng lượng"
      },
      {
        "id": 184,
        "jp_name": "速度",
        "en_name": "Speed",
        "vi_name" : "Tốc độ"
      },
      {
        "id": 185,
        "jp_name": "密度",
        "en_name": "Intensity",
        "vi_name" : "Mật độ"
      },
      {
        "id": 186,
        "jp_name": "温度",
        "en_name": "Temperature",
        "vi_name" : "Nhiệt độ"
      },
      {
        "id": 187,
        "jp_name": "カロリー",
        "en_name": "Calorie",
        "vi_name" : "Kalo"
      },
      {
        "id": 188,
        "jp_name": "震度",
        "en_name": "Seismic_Intensity",
        "vi_name" : "Độ rung (động đất)"
      },
      {
        "id": 189,
        "jp_name": "マグニチュード",
        "en_name": "Seismic_Magnitude",
        "vi_name" : "Độ richter"
      },
      {
        "id": 190,
        "jp_name": "個数_その他",
        "en_name": "Countx_Other",
        "vi_name" : "Số lượng"
      },
      {
        "id": 191,
        "jp_name": "人数",
        "en_name": "N_Person",
        "vi_name" : "Số người"
      },
      {
        "id": 192,
        "jp_name": "組織数",
        "en_name": "N_Organization",
        "vi_name" : "Số tổ chức"
      },
      {
        "id": 193,
        "jp_name": "場所数_その他",
        "en_name": "N_Location_Other",
        "vi_name" : "Số nơi, số địa điểm"
      },
      {
        "id": 194,
        "jp_name": "国数",
        "en_name": "N_Country",
        "vi_name" : "Số quốc gia"
      },
      {
        "id": 195,
        "jp_name": "施設数",
        "en_name": "N_Facility",
        "vi_name" : "Số cơ sở"
      },
      {
        "id": 196,
        "jp_name": "製品数",
        "en_name": "N_Product",
        "vi_name" : "Số sản phẩm"
      },
      {
        "id": 197,
        "jp_name": "イベント数",
        "en_name": "N_Event",
        "vi_name" : "Số sự kiện"
      },
      {
        "id": 198,
        "jp_name": "自然物数_その他",
        "en_name": "N_Natural_Object_Other",
        "vi_name" : "Số vật tự nhiên"
      },
      {
        "id": 199,
        "jp_name": "動物数",
        "en_name": "N_Animal",
        "vi_name" : "Số con"
      },
      {
        "id": 200,
        "jp_name": "植物数",
        "en_name": "N_Flora",
        "vi_name" : "Số cây"
      }
    ];
   var bodauTiengViet = function(str) {
    str = str.replace(/N_/g, " ");
    str = str.replace(/_/g, " ");
    return str;
  }
   var convertToName = function(){
    for(var i = 0; i < altCategoryDict.length; i++){
      altCategoryDict[i].en_name = bodauTiengViet(altCategoryDict[i].en_name);
       
    }
    return;
  }  

  service.getIdCategory = function(name, callback){
  	var tmp = null;
  	for(var i = 0; i < altCategoryDict.length; i++){
  		var en_name = altCategoryDict[i].en_name.toLowerCase();
  		var ChangeName = name.toLowerCase()
  		if(en_name.indexOf(ChangeName) != -1){
  			tmp = altCategoryDict[i];
  			return tmp;
  		}
  	}
  	return tmp;
  }  
   
  service.getAllCategory = function (callback) {
  	callback(altCategoryDict);
  }
  convertToName();
  return service;  
}]);