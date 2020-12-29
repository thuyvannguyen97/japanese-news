var dictUtilServices = angular.module('mazii.service.util', ['mazii.service.localstore']);


dictUtilServices.factory('dictUtilSer', ["$q", "$http", "$timeout", "$state", "localstoreServ",
    function ($q, $http, $timeout, $state, localstoreServ) {
    
    var service = {};
        
    var vietnameseChars = new Array("à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ", "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ", "ì", "í", "ị", "ỉ", "ĩ", "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ", "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ", "ỳ", "ý", "ỵ", "ỷ", "ỹ", "đ", "À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ", "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ", "Ì", "Í", "Ị", "Ỉ", "Ĩ", "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ", "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ", "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ", "Đ");
    var anphal = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

    var kindTables = {
        "MA": "martial arts term",
        "X": "rude or X-rated term (not displayed in educational software)",
        "abbr": "abbreviation",
        "adj-i": "adjective (keiyoushi)",
        "adj-ix": "adjective (keiyoushi) - yoi/ii class",
        "adj-na": "adjectival nouns or quasi-adjectives (keiyodoshi)",
        "adj-no": "nouns which may take the genitive case particle `no'",
        "adj-pn": "pre-noun adjectival (rentaishi)",
        "adj-t": "`taru' adjective",
        "adj-f": "noun or verb acting prenominally",
        "adv": "adverb (fukushi)",
        "adv-to": "adverb taking the `to' particle",
        "arch": "archaism",
        "ateji": "ateji (phonetic) reading" ,
        "aux": "auxiliary" ,
        "aux-v": "auxiliary verb" ,
        "aux-adj": "auxiliary adjective" ,
        "Buddh": "Buddhist term" ,
        "chem": "chemistry term" ,
        "chn": "children's language" ,
        "col": "colloquialism" ,
        "comp": "computer terminology" ,
        "conj": "conjunction" ,
        "cop-da": "copula" ,
        "ctr": "counter" ,
        "derog": "derogatory" ,
        "eK": "exclusively kanji" ,
        "ek": "exclusively kana" ,
        "exp": "expressions (phrases, clauses, etc.)" ,
        "fam": "familiar language" ,
        "fem": "female term or language" ,
        "food": "food term" ,
        "geom": "geometry term",
        "gikun": "gikun (meaning as reading) or jukujikun (special kanji reading)",
        "hon": "honorific or respectful (sonkeigo) language",
        "hum": "humble (kenjougo) language",
        "iK": "word containing irregular kanji usage",
        "id": "idiomatic expression",
        "ik": "word containing irregular kana usage",
        "int": "interjection (kandoushi)",
        "io": "irregular okurigana usage",
        "iv": "irregular verb",
        "ling": "linguistics terminology",
        "m-sl": "manga slang",
        "male": "male term or language",
        "male-sl": "male slang",
        "math": "mathematics",
        "mil": "military",
        "n": "noun (common) (futsuumeishi)",
        "n-adv": "adverbial noun (fukushitekimeishi)",
        "n-suf": "noun, used as a suffix",
        "n-pref": "noun, used as a prefix",
        "n-t": "noun (temporal) (jisoumeishi)",
        "num": "numeric",
        "oK": "word containing out-dated kanji",
        "obs": "obsolete term",
        "obsc": "obscure term",
        "ok": "out-dated or obsolete kana usage",
        "oik": "old or irregular kana form",
        "on-mim": "onomatopoeic or mimetic word",
        "pn": "pronoun",
        "poet": "poetical term",
        "pol": "polite (teineigo) language",
        "pref": "prefix",
        "proverb": "proverb",
        "prt": "particle",
        "physics": "physics terminology",
        "rare": "rare",
        "sens": "sensitive",
        "sl": "slang",
        "suf": "suffix",
        "uK": "word usually written using kanji alone",
        "uk": "word usually written using kana alone",
        "unc": "unclassified",
        "yoji": "yojijukugo",
        "v1": "Ichidan verb",
        "v1-s": "Ichidan verb - kureru special class",
        "v2a-s": "Nidan verb with 'u' ending (archaic)",
        "v4h": "Yodan verb with `hu/fu' ending (archaic)",
        "v4r": "Yodan verb with `ru' ending (archaic)",
        "v5aru": "Godan verb - -aru special class",
        "v5b": "Godan verb with `bu' ending",
        "v5g": "Godan verb with `gu' ending",
        "v5k": "Godan verb with `ku' ending",
        "v5k-s": "Godan verb - Iku/Yuku special class",
        "v5m": "Godan verb with `mu' ending",
        "v5n": "Godan verb with `nu' ending",
        "v5r": "Godan verb with `ru' ending",
        "v5r-i": "Godan verb with `ru' ending (irregular verb)",
        "v5s": "Godan verb with `su' ending",
        "v5t": "Godan verb with `tsu' ending",
        "v5u": "Godan verb with `u' ending",
        "v5u-s": "Godan verb with `u' ending (special class)",
        "v5uru": "Godan verb - Uru old class verb (old form of Eru)",
        "vz": "Ichidan verb - zuru verb (alternative form of -jiru verbs)",
        "vi": "intransitive verb",
        "vk": "Kuru verb - special class",
        "vn": "irregular nu verb",
        "vr": "irregular ru verb, plain form ends with -ri",
        "vs": "noun or participle which takes the aux. verb suru",
        "vs-c": "su verb - precursor to the modern suru",
        "vs-s": "suru verb - special class",
        "vs-i": "suru verb - irregular",
        "kyb": "Kyoto-ben",
        "osb": "Osaka-ben",
        "ksb": "Kansai-ben",
        "ktb": "Kantou-ben",
        "tsb": "Tosa-ben",
        "thb": "Touhoku-ben",
        "tsug": "Tsugaru-ben",
        "kyu": "Kyuushuu-ben",
        "rkb": "Ryuukyuu-ben",
        "nab": "Nagano-ben",
        "hob": "Hokkaido-ben",
        "vt": "transitive verb",
        "vulg": "vulgar expression or word",
        "adj-kari": "`kari' adjective (archaic)",
        "adj-ku": "`ku' adjective (archaic)",
        "adj-shiku": "`shiku' adjective (archaic)",
        "adj-nari": "archaic/formal form of na-adjective",
        "n-pr": "proper noun",
        "v-unspec": "verb unspecified",
        "v4k": "Yodan verb with `ku' ending (archaic)",
        "v4g": "Yodan verb with `gu' ending (archaic)",
        "v4s": "Yodan verb with `su' ending (archaic)",
        "v4t": "Yodan verb with `tsu' ending (archaic)",
        "v4n": "Yodan verb with `nu' ending (archaic)",
        "v4b": "Yodan verb with `bu' ending (archaic)",
        "v4m": "Yodan verb with `mu' ending (archaic)",
        "v2k-k": "Nidan verb (upper class) with `ku' ending (archaic)",
        "v2g-k": "Nidan verb (upper class) with `gu' ending (archaic)",
        "v2t-k": "Nidan verb (upper class) with `tsu' ending (archaic)",
        "v2d-k": "Nidan verb (upper class) with `dzu' ending (archaic)",
        "v2h-k": "Nidan verb (upper class) with `hu/fu' ending (archaic)",
        "v2b-k": "Nidan verb (upper class) with `bu' ending (archaic)",
        "v2m-k": "Nidan verb (upper class) with `mu' ending (archaic)",
        "v2y-k": "Nidan verb (upper class) with `yu' ending (archaic)",
        "v2r-k": "Nidan verb (upper class) with `ru' ending (archaic)",
        "v2k-s": "Nidan verb (lower class) with `ku' ending (archaic)",
        "v2g-s": "Nidan verb (lower class) with `gu' ending (archaic)",
        "v2s-s": "Nidan verb (lower class) with `su' ending (archaic)",
        "v2z-s": "Nidan verb (lower class) with `zu' ending (archaic)",
        "v2t-s": "Nidan verb (lower class) with `tsu' ending (archaic)",
        "v2d-s": "Nidan verb (lower class) with `dzu' ending (archaic)",
        "v2n-s": "Nidan verb (lower class) with `nu' ending (archaic)",
        "v2h-s": "Nidan verb (lower class) with `hu/fu' ending (archaic)",
        "v2b-s": "Nidan verb (lower class) with `bu' ending (archaic)",
        "v2m-s": "Nidan verb (lower class) with `mu' ending (archaic)",
        "v2y-s": "Nidan verb (lower class) with `yu' ending (archaic)",
        "v2r-s": "Nidan verb (lower class) with `ru' ending (archaic)",
        "v2w-s": "Nidan verb (lower class) with `u' ending and `we' conjugation (archaic)",
        "archit": "architecture term",
        "astron": "astronomy, etc. term",
        "baseb": "baseball term",
        "biol": "biology term",
        "bot": "botany term",
        "bus": "business term",
        "econ": "economics term",
        "engr": "engineering term",
        "finc": "finance term",
        "geol": "geology, etc. term",
        "law": "law, etc. term",
        "mahj": "mahjong term",
        "med": "medicine, etc. term",
        "music": "music term",
        "Shinto": "Shinto term",
        "shogi": "shogi term",
        "sports": "sports term",
        "sumo": "sumo term",
        "zool": "zoology term",
        "joc": "jocular, humorous term",
        "anat": "anatomical term"

    };    
        
    
    var altLevelDict = {
      "level_1_2_en": {
        "Product": [
          "Product_Other",
          "Material",
          "Clothing",
          "Money_Form",
          "Drug",
          "Weapon",
          "Stock",
          "Award",
          "Decoration",
          "Offense",
          "Service",
          "Class",
          "Character",
          "ID_Number",
          "Vehicle",
          "Food",
          "Art",
          "Printing",
          "Doctrine_Method",
          "Rule",
          "Titile",
          "Language",
          "Unit"
        ],
        "Facility": [
          "Facility_Other",
          "Facility_Part",
          "Archaeological_Place",
          "GOE",
          "Line"
        ],
        "Name_Other": [
          "Name_Other"
        ],
        "Organizaton": [
          "Organization_Other",
          "International_Organization",
          "Show_Organization",
          "Family",
          "Ethnic_Group",
          "Sports_Organization",
          "Corporation",
          "Political_Organization"
        ],
        "Natural_Object": [
          "Natural_Object_Other",
          "Element",
          "Compound",
          "Mineral",
          "Living_Thing",
          "Living_Thing_Part"
        ],
        "Disease": [
          "Disease_Other",
          "Animal_Disease"
        ],
        "Person": [
          "Person"
        ],
        "Location": [
          "Location_Other",
          "Spa",
          "GPE",
          "Region",
          "Geological_Region",
          "Astral_Body",
          "Address"
        ],
        "God": [
          "God"
        ],
        "Color": [
          "Color_Other",
          "Nature_Color"
        ],
        "Event": [
          "Event_Other",
          "Occasion",
          "Incident",
          "Natural_Phenomenon"
        ]
      },
      "level_3_2_en": {
        "Canal": "Line",
        "Material": "Material",
        "Service": "Service",
        "Character": "Character",
        "National_Language": "Language",
        "Political_Party": "Political_Organization",
        "Religion": "Doctrine_Method",
        "Station": "GOE",
        "Nature_Color": "Nature_Color",
        "Show_Organization": "Show_Organization",
        "Spaceship": "Vehicle",
        "Province": "GPE",
        "Organization_Other": "Organization_Other",
        "Position_Vocation": "Titile",
        "Company": "Corporation",
        "Event_Other": "Event_Other",
        "Game": "Occasion",
        "Award": "Award",
        "Cabinet": "Political_Organization",
        "Living_Thing_Part_Other": "Living_Thing_Part",
        "Road": "Line",
        "GPE_Other": "GPE",
        "Earthquake": "Natural_Phenomenon",
        "International_Organization": "International_Organization",
        "URL": "Address",
        "Car": "Vehicle",
        "Pro_Sports_Organization": "Sports_Organization",
        "Drug": "Drug",
        "Bay": "Geological_Region",
        "Magazine": "Printing",
        "Broadcast_Program": "Art",
        "Newspaper": "Printing",
        "Military": "Political_Organization",
        "River": "Geological_Region",
        "GOE_Other": "GOE",
        "Archaeological_Place_Other": "Archaeological_Place",
        "Domestic_Region": "Region",
        "Show": "Art",
        "Food_Other": "Food",
        "Sports_Facility": "GOE",
        "Dish": "Food",
        "Spa": "Spa",
        "Sport": "Doctrine_Method",
        "Corporation_Other": "Corporation",
        "Location_Other": "Location_Other",
        "Museum": "GOE",
        "Incident_Other": "Incident",
        "Zoo": "GOE",
        "Facility_Other": "Facility_Other",
        "Title_Other": "Titile",
        "Region_Other": "Region",
        "Email": "Address",
        "Mollusk_Arthropod": "Living_Thing",
        "Picture": "Art",
        "Government": "Political_Organization",
        "Product_Other": "Product_Other",
        "Park": "GOE",
        "Bird": "Living_Thing",
        "Public_Institution": "GOE",
        "Worship_Place": "GOE",
        "Compound": "Compound",
        "Railroad": "Line",
        "Class": "Class",
        "School": "GOE",
        "Theater": "GOE",
        "Mineral": "Mineral",
        "Tunnel": "Line",
        "Planet": "Astral_Body",
        "Car_Stop": "GOE",
        "Religious_Festival": "Occasion",
        "Company_Group": "Corporation",
        "Amphibia": "Living_Thing",
        "Unit_Other": "Unit",
        "Theory": "Doctrine_Method",
        "Natural_Phenomenon_Other": "Natural_Phenomenon",
        "Natural_Object_Other": "Natural_Object_Other",
        "Fish": "Living_Thing",
        "Language_Other": "Language",
        "Art_Other": "Art",
        "Currency": "Unit",
        "Line_Other": "Line",
        "Continental_Region": "Region",
        "Mountain": "Geological_Region",
        "Style": "Doctrine_Method",
        "Postal_Address": "Address",
        "City": "GPE",
        "Book": "Art",
        "Music": "Art",
        "Printing_Other": "Printing",
        "Ethnic_Group_Other": "Ethnic_Group",
        "War": "Incident",
        "Movement": "Doctrine_Method",
        "Star": "Astral_Body",
        "Living_Thing_Other": "Living_Thing",
        "Name_Other": "Name_Other",
        "Aircraft": "Vehicle",
        "Fungus": "Living_Thing",
        "Insect": "Living_Thing",
        "Train": "Vehicle",
        "Plan": "Doctrine_Method",
        "Movie": "Art",
        "Rule_Other": "Rule",
        "Flora": "Living_Thing",
        "Bridge": "Line",
        "Weapon": "Weapon",
        "Amusement_Park": "GOE",
        "Vehicle_Other": "Vehicle",
        "Treaty": "Rule",
        "Person": "Person",
        "Animal_Part": "Living_Thing_Part",
        "Sports_League": "Sports_Organization",
        "Sports_Organization_Other": "Sports_Organization",
        "Family": "Family",
        "County": "GPE",
        "Culture": "Doctrine_Method",
        "Color_Other": "Color_Other",
        "Sea": "Geological_Region",
        "Doctrine_Method_Other": "Doctrine_Method",
        "Offense": "Offense",
        "Constellation": "Astral_Body",
        "Market": "GOE",
        "Conference": "Occasion",
        "Phone_Number": "Address",
        "Address_Other": "Address",
        "Flora_Part": "Living_Thing_Part",
        "God": "God",
        "Lake": "Geological_Region",
        "Facility_Part": "Facility_Part",
        "Stock": "Stock",
        "ID_Number": "ID_Number",
        "Astral_Body_Other": "Astral_Body",
        "Research_Institute": "GOE",
        "Tumulus": "Archaeological_Place",
        "Island": "Geological_Region",
        "Disease_Other": "Disease_Other",
        "Nationality": "Ethnic_Group",
        "Law": "Rule",
        "Geological_Region_Other": "Geological_Region",
        "Animal_Disease": "Animal_Disease",
        "Money_Form": "Money_Form",
        "Water_Route": "Line",
        "Country": "GPE",
        "Element": "Element",
        "Airport": "GOE",
        "Mammal": "Living_Thing",
        "Political_Organization_Other": "Political_Organization",
        "Occasion_Other": "Occasion",
        "Natural_Disaster": "Natural_Phenomenon",
        "Reptile": "Living_Thing",
        "Academic": "Doctrine_Method",
        "Decoration": "Decoration",
        "Ship": "Vehicle",
        "Clothing": "Clothing",
        "Port": "GOE"
      },
      "level_2_1_en": {
        "Location_Other": "Location",
        "Product_Other": "Product",
        "Service": "Product",
        "Corporation": "Organizaton",
        "Character": "Product",
        "Ethnic_Group": "Organizaton",
        "Facility_Other": "Facility",
        "Nature_Color": "Color",
        "Show_Organization": "Organizaton",
        "Vehicle": "Product",
        "Facility_Part": "Facility",
        "Geological_Region": "Location",
        "Stock": "Product",
        "Organization_Other": "Organizaton",
        "Living_Thing": "Natural_Object",
        "ID_Number": "Product",
        "Archaeological_Place": "Facility",
        "Material": "Product",
        "Event_Other": "Event",
        "Award": "Product",
        "God": "God",
        "Occasion": "Event",
        "Incident": "Event",
        "Compound": "Natural_Object",
        "Disease_Other": "Disease",
        "Line": "Facility",
        "Natural_Phenomenon": "Event",
        "Class": "Product",
        "Titile": "Product",
        "International_Organization": "Organizaton",
        "Animal_Disease": "Disease",
        "Money_Form": "Product",
        "Mineral": "Natural_Object",
        "Language": "Product",
        "GOE": "Facility",
        "GPE": "Location",
        "Weapon": "Product",
        "Living_Thing_Part": "Natural_Object",
        "Drug": "Product",
        "Name_Other": "Name_Other",
        "Person": "Person",
        "Printing": "Product",
        "Rule": "Product",
        "Spa": "Location",
        "Natural_Object_Other": "Natural_Object",
        "Element": "Natural_Object",
        "Sports_Organization": "Organizaton",
        "Art": "Product",
        "Family": "Organizaton",
        "Astral_Body": "Location",
        "Decoration": "Product",
        "Food": "Product",
        "Political_Organization": "Organizaton",
        "Region": "Location",
        "Color_Other": "Color",
        "Offense": "Product",
        "Clothing": "Product",
        "Doctrine_Method": "Product",
        "Unit": "Product",
        "Address": "Location"
      },
      "level_3_1_en": {
        "Continental_Region": "Location",
        "Material": "Product",
        "Service": "Product",
        "Character": "Product",
        "National_Language": "Product",
        "Political_Party": "Organizaton",
        "Religion": "Product",
        "Station": "Facility",
        "Nature_Color": "Color",
        "Show_Organization": "Organizaton",
        "Spaceship": "Product",
        "Province": "Location",
        "Organization_Other": "Organizaton",
        "Theory": "Product",
        "Phone_Number": "Location",
        "Company": "Organizaton",
        "Event_Other": "Event",
        "Game": "Event",
        "Award": "Product",
        "Cabinet": "Organizaton",
        "Living_Thing_Part_Other": "Natural_Object",
        "Sports_League": "Organizaton",
        "GPE_Other": "Location",
        "Earthquake": "Event",
        "International_Organization": "Organizaton",
        "URL": "Location",
        "Car": "Product",
        "Pro_Sports_Organization": "Organizaton",
        "Drug": "Product",
        "Bay": "Location",
        "Magazine": "Product",
        "Broadcast_Program": "Product",
        "Newspaper": "Product",
        "Military": "Organizaton",
        "River": "Location",
        "Email": "Location",
        "GOE_Other": "Facility",
        "Archaeological_Place_Other": "Facility",
        "Domestic_Region": "Location",
        "Show": "Product",
        "Food_Other": "Product",
        "Sports_Facility": "Facility",
        "Dish": "Product",
        "Spa": "Location",
        "Sport": "Product",
        "Corporation_Other": "Organizaton",
        "Location_Other": "Location",
        "Museum": "Facility",
        "Incident_Other": "Event",
        "Zoo": "Facility",
        "Facility_Other": "Facility",
        "Title_Other": "Product",
        "Region_Other": "Location",
        "Research_Institute": "Facility",
        "Tumulus": "Facility",
        "Picture": "Product",
        "Government": "Organizaton",
        "Product_Other": "Product",
        "Park": "Facility",
        "Bird": "Natural_Object",
        "Public_Institution": "Facility",
        "Worship_Place": "Facility",
        "Compound": "Natural_Object",
        "Railroad": "Facility",
        "Class": "Product",
        "School": "Facility",
        "Theater": "Facility",
        "Mineral": "Natural_Object",
        "Tunnel": "Facility",
        "Planet": "Location",
        "Car_Stop": "Facility",
        "Religious_Festival": "Event",
        "Company_Group": "Organizaton",
        "Amphibia": "Natural_Object",
        "Element": "Natural_Object",
        "Vehicle_Other": "Product",
        "Natural_Object_Other": "Natural_Object",
        "Fish": "Natural_Object",
        "Living_Thing_Other": "Natural_Object",
        "Art_Other": "Product",
        "Currency": "Product",
        "Line_Other": "Facility",
        "Canal": "Facility",
        "Mountain": "Location",
        "Style": "Product",
        "Postal_Address": "Location",
        "Natural_Disaster": "Event",
        "Book": "Product",
        "Music": "Product",
        "Printing_Other": "Product",
        "Ethnic_Group_Other": "Organizaton",
        "War": "Event",
        "Movement": "Product",
        "Star": "Location",
        "Language_Other": "Product",
        "Name_Other": "Name_Other",
        "Insect": "Natural_Object",
        "Fungus": "Natural_Object",
        "Aircraft": "Product",
        "Train": "Product",
        "Plan": "Product",
        "God": "God",
        "Rule_Other": "Product",
        "Flora": "Natural_Object",
        "Weapon": "Product",
        "Amusement_Park": "Facility",
        "Natural_Phenomenon_Other": "Event",
        "Treaty": "Product",
        "Academic": "Product",
        "Animal_Part": "Natural_Object",
        "Road": "Facility",
        "Sports_Organization_Other": "Organizaton",
        "Family": "Organizaton",
        "County": "Location",
        "Culture": "Product",
        "Color_Other": "Color",
        "Sea": "Location",
        "Doctrine_Method_Other": "Product",
        "Offense": "Product",
        "Constellation": "Location",
        "Market": "Facility",
        "Conference": "Event",
        "City": "Location",
        "Address_Other": "Location",
        "Flora_Part": "Natural_Object",
        "Movie": "Product",
        "Lake": "Location",
        "Facility_Part": "Facility",
        "Stock": "Product",
        "ID_Number": "Product",
        "Position_Vocation": "Product",
        "Astral_Body_Other": "Location",
        "Mollusk_Arthropod": "Natural_Object",
        "Island": "Location",
        "Disease_Other": "Disease",
        "Nationality": "Organizaton",
        "Law": "Product",
        "Geological_Region_Other": "Location",
        "Animal_Disease": "Disease",
        "Money_Form": "Product",
        "Water_Route": "Facility",
        "Country": "Location",
        "Unit_Other": "Product",
        "Airport": "Facility",
        "Mammal": "Natural_Object",
        "Political_Organization_Other": "Organizaton",
        "Occasion_Other": "Event",
        "Bridge": "Facility",
        "Reptile": "Natural_Object",
        "Person": "Person",
        "Decoration": "Product",
        "Ship": "Product",
        "Clothing": "Product",
        "Port": "Facility"
      },
      "level_1_3_en": {
        "Product": [
          "Product_Other",
          "Material",
          "Clothing",
          "Money_Form",
          "Drug",
          "Weapon",
          "Stock",
          "Award",
          "Decoration",
          "Offense",
          "Service",
          "Class",
          "Character",
          "ID_Number",
          "Vehicle_Other",
          "Car",
          "Train",
          "Aircraft",
          "Spaceship",
          "Ship",
          "Food_Other",
          "Dish",
          "Art_Other",
          "Picture",
          "Broadcast_Program",
          "Movie",
          "Show",
          "Music",
          "Book",
          "Printing_Other",
          "Newspaper",
          "Magazine",
          "Doctrine_Method_Other",
          "Culture",
          "Religion",
          "Academic",
          "Sport",
          "Style",
          "Movement",
          "Theory",
          "Plan",
          "Rule_Other",
          "Treaty",
          "Law",
          "Title_Other",
          "Position_Vocation",
          "Language_Other",
          "National_Language",
          "Unit_Other",
          "Currency"
        ],
        "Facility": [
          "Facility_Other",
          "Facility_Part",
          "Archaeological_Place_Other",
          "Tumulus",
          "GOE_Other",
          "Public_Institution",
          "School",
          "Research_Institute",
          "Market",
          "Park",
          "Sports_Facility",
          "Museum",
          "Zoo",
          "Amusement_Park",
          "Theater",
          "Worship_Place",
          "Car_Stop",
          "Station",
          "Airport",
          "Port",
          "Line_Other",
          "Railroad",
          "Road",
          "Canal",
          "Water_Route",
          "Tunnel",
          "Bridge"
        ],
        "Name_Other": [
          "Name_Other"
        ],
        "Organizaton": [
          "Organization_Other",
          "International_Organization",
          "Show_Organization",
          "Family",
          "Ethnic_Group_Other",
          "Nationality",
          "Sports_Organization_Other",
          "Pro_Sports_Organization",
          "Sports_League",
          "Corporation_Other",
          "Company",
          "Company_Group",
          "Political_Organization_Other",
          "Government",
          "Political_Party",
          "Cabinet",
          "Military"
        ],
        "Natural_Object": [
          "Natural_Object_Other",
          "Element",
          "Compound",
          "Mineral",
          "Living_Thing_Other",
          "Fungus",
          "Mollusk_Arthropod",
          "Insect",
          "Fish",
          "Amphibia",
          "Reptile",
          "Bird",
          "Mammal",
          "Flora",
          "Living_Thing_Part_Other",
          "Animal_Part",
          "Flora_Part"
        ],
        "Disease": [
          "Disease_Other",
          "Animal_Disease"
        ],
        "Person": [
          "Person"
        ],
        "Location": [
          "Location_Other",
          "Spa",
          "GPE_Other",
          "City",
          "County",
          "Province",
          "Country",
          "Region_Other",
          "Continental_Region",
          "Domestic_Region",
          "Geological_Region_Other",
          "Mountain",
          "Island",
          "River",
          "Lake",
          "Sea",
          "Bay",
          "Astral_Body_Other",
          "Star",
          "Planet",
          "Constellation",
          "Address_Other",
          "Postal_Address",
          "Phone_Number",
          "Email",
          "URL"
        ],
        "God": [
          "God"
        ],
        "Color": [
          "Color_Other",
          "Nature_Color"
        ],
        "Event": [
          "Event_Other",
          "Occasion_Other",
          "Religious_Festival",
          "Game",
          "Conference",
          "Incident_Other",
          "War",
          "Natural_Phenomenon_Other",
          "Natural_Disaster",
          "Earthquake"
        ]
      },
      "level_2_3_en": {
        "Location_Other": [
          "Location_Other"
        ],
        "Material": [
          "Material"
        ],
        "Service": [
          "Service"
        ],
        "God": [
          "God"
        ],
        "Character": [
          "Character"
        ],
        "Ethnic_Group": [
          "Ethnic_Group_Other",
          "Nationality"
        ],
        "Facility_Other": [
          "Facility_Other"
        ],
        "Nature_Color": [
          "Nature_Color"
        ],
        "Show_Organization": [
          "Show_Organization"
        ],
        "Vehicle": [
          "Vehicle_Other",
          "Car",
          "Train",
          "Aircraft",
          "Spaceship",
          "Ship"
        ],
        "Facility_Part": [
          "Facility_Part"
        ],
        "Geological_Region": [
          "Geological_Region_Other",
          "Mountain",
          "Island",
          "River",
          "Lake",
          "Sea",
          "Bay"
        ],
        "Food": [
          "Food_Other",
          "Dish"
        ],
        "Stock": [
          "Stock"
        ],
        "Corporation": [
          "Corporation_Other",
          "Company",
          "Company_Group"
        ],
        "Organization_Other": [
          "Organization_Other"
        ],
        "Living_Thing": [
          "Living_Thing_Other",
          "Fungus",
          "Mollusk_Arthropod",
          "Insect",
          "Fish",
          "Amphibia",
          "Reptile",
          "Bird",
          "Mammal",
          "Flora"
        ],
        "Name_Other": [
          "Name_Other"
        ],
        "Archaeological_Place": [
          "Archaeological_Place_Other",
          "Tumulus"
        ],
        "Product_Other": [
          "Product_Other"
        ],
        "Event_Other": [
          "Event_Other"
        ],
        "Award": [
          "Award"
        ],
        "Incident": [
          "Incident_Other",
          "War"
        ],
        "Address": [
          "Address_Other",
          "Postal_Address",
          "Phone_Number",
          "Email",
          "URL"
        ],
        "Disease_Other": [
          "Disease_Other"
        ],
        "Sports_Organization": [
          "Sports_Organization_Other",
          "Pro_Sports_Organization",
          "Sports_League"
        ],
        "Natural_Phenomenon": [
          "Natural_Phenomenon_Other",
          "Natural_Disaster",
          "Earthquake"
        ],
        "Weapon": [
          "Weapon"
        ],
        "Titile": [
          "Title_Other",
          "Position_Vocation"
        ],
        "International_Organization": [
          "International_Organization"
        ],
        "Animal_Disease": [
          "Animal_Disease"
        ],
        "Money_Form": [
          "Money_Form"
        ],
        "Mineral": [
          "Mineral"
        ],
        "Language": [
          "Language_Other",
          "National_Language"
        ],
        "Color_Other": [
          "Color_Other"
        ],
        "GOE": [
          "GOE_Other",
          "Public_Institution",
          "School",
          "Research_Institute",
          "Market",
          "Park",
          "Sports_Facility",
          "Museum",
          "Zoo",
          "Amusement_Park",
          "Theater",
          "Worship_Place",
          "Car_Stop",
          "Station",
          "Airport",
          "Port"
        ],
        "GPE": [
          "GPE_Other",
          "City",
          "County",
          "Province",
          "Country"
        ],
        "Region": [
          "Region_Other",
          "Continental_Region",
          "Domestic_Region"
        ],
        "Compound": [
          "Compound"
        ],
        "Drug": [
          "Drug"
        ],
        "Element": [
          "Element"
        ],
        "Person": [
          "Person"
        ],
        "Political_Organization": [
          "Political_Organization_Other",
          "Government",
          "Political_Party",
          "Cabinet",
          "Military"
        ],
        "Rule": [
          "Rule_Other",
          "Treaty",
          "Law"
        ],
        "Offense": [
          "Offense"
        ],
        "Occasion": [
          "Occasion_Other",
          "Religious_Festival",
          "Game",
          "Conference"
        ],
        "Line": [
          "Line_Other",
          "Railroad",
          "Road",
          "Canal",
          "Water_Route",
          "Tunnel",
          "Bridge"
        ],
        "Art": [
          "Art_Other",
          "Picture",
          "Broadcast_Program",
          "Movie",
          "Show",
          "Music",
          "Book"
        ],
        "Family": [
          "Family"
        ],
        "Astral_Body": [
          "Astral_Body_Other",
          "Star",
          "Planet",
          "Constellation"
        ],
        "Living_Thing_Part": [
          "Living_Thing_Part_Other",
          "Animal_Part",
          "Flora_Part"
        ],
        "Class": [
          "Class"
        ],
        "Decoration": [
          "Decoration"
        ],
        "ID_Number": [
          "ID_Number"
        ],
        "Printing": [
          "Printing_Other",
          "Newspaper",
          "Magazine"
        ],
        "Natural_Object_Other": [
          "Natural_Object_Other"
        ],
        "Spa": [
          "Spa"
        ],
        "Clothing": [
          "Clothing"
        ],
        "Doctrine_Method": [
          "Doctrine_Method_Other",
          "Culture",
          "Religion",
          "Academic",
          "Sport",
          "Style",
          "Movement",
          "Theory",
          "Plan"
        ],
        "Unit": [
          "Unit_Other",
          "Currency"
        ]
      }
    };
        
    var altCategoryDict = [
      {
        "id": 1,
        "jp_name": "名前_その他",
        "en_name": "Name_Other"
      },
      {
        "id": 2,
        "jp_name": "人名",
        "en_name": "Person"
      },
      {
        "id": 3,
        "jp_name": "神名",
        "en_name": "God"
      },
      {
        "id": 4,
        "jp_name": "組織名_その他",
        "en_name": "Organization_Other"
      },
      {
        "id": 5,
        "jp_name": "国際組織名",
        "en_name": "International_Organization"
      },
      {
        "id": 6,
        "jp_name": "公演組織名",
        "en_name": "Show_Organization"
      },
      {
        "id": 7,
        "jp_name": "家系名",
        "en_name": "Family"
      },
      {
        "id": 8,
        "jp_name": "民族名_その他",
        "en_name": "Ethnic_Group_Other"
      },
      {
        "id": 9,
        "jp_name": "国籍名",
        "en_name": "Nationality"
      },
      {
        "id": 10,
        "jp_name": "競技組織名_その他",
        "en_name": "Sports_Organization_Other"
      },
      {
        "id": 11,
        "jp_name": "プロ競技組織名",
        "en_name": "Pro_Sports_Organization"
      },
      {
        "id": 12,
        "jp_name": "競技リーグ名",
        "en_name": "Sports_League"
      },
      {
        "id": 13,
        "jp_name": "法人名_その他",
        "en_name": "Corporation_Other"
      },
      {
        "id": 14,
        "jp_name": "企業名",
        "en_name": "Company"
      },
      {
        "id": 15,
        "jp_name": "企業グループ名",
        "en_name": "Company_Group"
      },
      {
        "id": 16,
        "jp_name": "政治的組織名_その他",
        "en_name": "Political_Organization_Other"
      },
      {
        "id": 17,
        "jp_name": "政府組織名",
        "en_name": "Government"
      },
      {
        "id": 18,
        "jp_name": "政党名",
        "en_name": "Political_Party"
      },
      {
        "id": 19,
        "jp_name": "内閣名",
        "en_name": "Cabinet"
      },
      {
        "id": 20,
        "jp_name": "軍隊名",
        "en_name": "Military"
      },
      {
        "id": 21,
        "jp_name": "地名_その他",
        "en_name": "Location_Other"
      },
      {
        "id": 22,
        "jp_name": "温泉名",
        "en_name": "Spa"
      },
      {
        "id": 23,
        "jp_name": "GPE_その他",
        "en_name": "GPE_Other"
      },
      {
        "id": 24,
        "jp_name": "市区町村名",
        "en_name": "City"
      },
      {
        "id": 25,
        "jp_name": "郡名",
        "en_name": "County"
      },
      {
        "id": 26,
        "jp_name": "都道府県州名",
        "en_name": "Province"
      },
      {
        "id": 27,
        "jp_name": "国名",
        "en_name": "Country"
      },
      {
        "id": 28,
        "jp_name": "地域名_その他",
        "en_name": "Region_Other"
      },
      {
        "id": 29,
        "jp_name": "大陸地域名",
        "en_name": "Continental_Region"
      },
      {
        "id": 30,
        "jp_name": "国内地域名",
        "en_name": "Domestic_Region"
      },
      {
        "id": 31,
        "jp_name": "地形名_その他",
        "en_name": "Geological_Region_Other"
      },
      {
        "id": 32,
        "jp_name": "山地名",
        "en_name": "Mountain"
      },
      {
        "id": 33,
        "jp_name": "島名",
        "en_name": "Island"
      },
      {
        "id": 34,
        "jp_name": "河川名",
        "en_name": "River"
      },
      {
        "id": 35,
        "jp_name": "湖沼名",
        "en_name": "Lake"
      },
      {
        "id": 36,
        "jp_name": "海洋名",
        "en_name": "Sea"
      },
      {
        "id": 37,
        "jp_name": "湾名",
        "en_name": "Bay"
      },
      {
        "id": 38,
        "jp_name": "天体名_その他",
        "en_name": "Astral_Body_Other"
      },
      {
        "id": 39,
        "jp_name": "恒星名",
        "en_name": "Star"
      },
      {
        "id": 40,
        "jp_name": "惑星名",
        "en_name": "Planet"
      },
      {
        "id": 41,
        "jp_name": "星座名",
        "en_name": "Constellation"
      },
      {
        "id": 42,
        "jp_name": "アドレス_その他",
        "en_name": "Address_Other"
      },
      {
        "id": 43,
        "jp_name": "郵便住所",
        "en_name": "Postal_Address"
      },
      {
        "id": 44,
        "jp_name": "電話番号",
        "en_name": "Phone_Number"
      },
      {
        "id": 45,
        "jp_name": "電子メイル",
        "en_name": "Email"
      },
      {
        "id": 46,
        "jp_name": "URL",
        "en_name": "URL"
      },
      {
        "id": 47,
        "jp_name": "施設名_その他",
        "en_name": "Facility_Other"
      },
      {
        "id": 48,
        "jp_name": "施設部分名",
        "en_name": "Facility_Part"
      },
      {
        "id": 49,
        "jp_name": "遺跡名_その他",
        "en_name": "Archaeological_Place_Other"
      },
      {
        "id": 50,
        "jp_name": "古墳名",
        "en_name": "Tumulus"
      },
      {
        "id": 51,
        "jp_name": "GOE_その他",
        "en_name": "GOE_Other"
      },
      {
        "id": 52,
        "jp_name": "公共機関名",
        "en_name": "Public_Institution"
      },
      {
        "id": 53,
        "jp_name": "学校名",
        "en_name": "School"
      },
      {
        "id": 54,
        "jp_name": "研究機関名",
        "en_name": "Research_Institute"
      },
      {
        "id": 55,
        "jp_name": "取引所名",
        "en_name": "Market"
      },
      {
        "id": 56,
        "jp_name": "公園名",
        "en_name": "Park"
      },
      {
        "id": 57,
        "jp_name": "競技施設名",
        "en_name": "Sports_Facility"
      },
      {
        "id": 58,
        "jp_name": "美術博物館名",
        "en_name": "Museum"
      },
      {
        "id": 59,
        "jp_name": "動植物園名",
        "en_name": "Zoo"
      },
      {
        "id": 60,
        "jp_name": "遊園施設名",
        "en_name": "Amusement_Park"
      },
      {
        "id": 61,
        "jp_name": "劇場名",
        "en_name": "Theater"
      },
      {
        "id": 62,
        "jp_name": "神社寺名",
        "en_name": "Worship_Place"
      },
      {
        "id": 63,
        "jp_name": "停車場名",
        "en_name": "Car_Stop"
      },
      {
        "id": 64,
        "jp_name": "電車駅名",
        "en_name": "Station"
      },
      {
        "id": 65,
        "jp_name": "空港名",
        "en_name": "Airport"
      },
      {
        "id": 66,
        "jp_name": "港名",
        "en_name": "Port"
      },
      {
        "id": 67,
        "jp_name": "路線名_その他",
        "en_name": "Line_Other"
      },
      {
        "id": 68,
        "jp_name": "電車路線名",
        "en_name": "Railroad"
      },
      {
        "id": 69,
        "jp_name": "道路名",
        "en_name": "Road"
      },
      {
        "id": 70,
        "jp_name": "運河名",
        "en_name": "Canal"
      },
      {
        "id": 71,
        "jp_name": "航路名",
        "en_name": "Water_Route"
      },
      {
        "id": 72,
        "jp_name": "トンネル名",
        "en_name": "Tunnel"
      },
      {
        "id": 73,
        "jp_name": "橋名",
        "en_name": "Bridge"
      },
      {
        "id": 74,
        "jp_name": "製品名_その他",
        "en_name": "Product_Other"
      },
      {
        "id": 75,
        "jp_name": "材料名",
        "en_name": "Material"
      },
      {
        "id": 76,
        "jp_name": "衣類名",
        "en_name": "Clothing"
      },
      {
        "id": 77,
        "jp_name": "貨幣名",
        "en_name": "Money_Form"
      },
      {
        "id": 78,
        "jp_name": "医薬品名",
        "en_name": "Drug"
      },
      {
        "id": 79,
        "jp_name": "武器名",
        "en_name": "Weapon"
      },
      {
        "id": 80,
        "jp_name": "株名",
        "en_name": "Stock"
      },
      {
        "id": 81,
        "jp_name": "賞名",
        "en_name": "Award"
      },
      {
        "id": 82,
        "jp_name": "勲章名",
        "en_name": "Decoration"
      },
      {
        "id": 83,
        "jp_name": "罪名",
        "en_name": "Offense"
      },
      {
        "id": 84,
        "jp_name": "便名",
        "en_name": "Service"
      },
      {
        "id": 85,
        "jp_name": "等級名",
        "en_name": "Class"
      },
      {
        "id": 86,
        "jp_name": "キャラクター名",
        "en_name": "Character"
      },
      {
        "id": 87,
        "jp_name": "識別番号",
        "en_name": "ID_Number"
      },
      {
        "id": 88,
        "jp_name": "乗り物名_その他",
        "en_name": "Vehicle_Other"
      },
      {
        "id": 89,
        "jp_name": "車名",
        "en_name": "Car"
      },
      {
        "id": 90,
        "jp_name": "列車名",
        "en_name": "Train"
      },
      {
        "id": 91,
        "jp_name": "飛行機名",
        "en_name": "Aircraft"
      },
      {
        "id": 92,
        "jp_name": "宇宙船名",
        "en_name": "Spaceship"
      },
      {
        "id": 93,
        "jp_name": "船名",
        "en_name": "Ship"
      },
      {
        "id": 94,
        "jp_name": "食べ物名_その他",
        "en_name": "Food_Other"
      },
      {
        "id": 95,
        "jp_name": "料理名",
        "en_name": "Dish"
      },
      {
        "id": 96,
        "jp_name": "芸術作品名_その他",
        "en_name": "Art_Other"
      },
      {
        "id": 97,
        "jp_name": "絵画名",
        "en_name": "Picture"
      },
      {
        "id": 98,
        "jp_name": "番組名",
        "en_name": "Broadcast_Program"
      },
      {
        "id": 99,
        "jp_name": "映画名",
        "en_name": "Movie"
      },
      {
        "id": 100,
        "jp_name": "公演名",
        "en_name": "Show"
      },
      {
        "id": 101,
        "jp_name": "音楽名",
        "en_name": "Music"
      },
      {
        "id": 102,
        "jp_name": "文学名",
        "en_name": "Book"
      },
      {
        "id": 103,
        "jp_name": "出版物名_その他",
        "en_name": "Printing_Other"
      },
      {
        "id": 104,
        "jp_name": "新聞名",
        "en_name": "Newspaper"
      },
      {
        "id": 105,
        "jp_name": "雑誌名",
        "en_name": "Magazine"
      },
      {
        "id": 106,
        "jp_name": "主義方式名_その他",
        "en_name": "Doctrine_Method_Other"
      },
      {
        "id": 107,
        "jp_name": "文化名",
        "en_name": "Culture"
      },
      {
        "id": 108,
        "jp_name": "宗教名",
        "en_name": "Religion"
      },
      {
        "id": 109,
        "jp_name": "学問名",
        "en_name": "Academic"
      },
      {
        "id": 110,
        "jp_name": "競技名",
        "en_name": "Sport"
      },
      {
        "id": 111,
        "jp_name": "流派名",
        "en_name": "Style"
      },
      {
        "id": 112,
        "jp_name": "運動名",
        "en_name": "Movement"
      },
      {
        "id": 113,
        "jp_name": "理論名",
        "en_name": "Theory"
      },
      {
        "id": 114,
        "jp_name": "政策計画名",
        "en_name": "Plan"
      },
      {
        "id": 115,
        "jp_name": "規則名_その他",
        "en_name": "Rule_Other"
      },
      {
        "id": 116,
        "jp_name": "条約名",
        "en_name": "Treaty"
      },
      {
        "id": 117,
        "jp_name": "法令名",
        "en_name": "Law"
      },
      {
        "id": 118,
        "jp_name": "称号名_その他",
        "en_name": "Title_Other"
      },
      {
        "id": 119,
        "jp_name": "地位職業名",
        "en_name": "Position_Vocation"
      },
      {
        "id": 120,
        "jp_name": "言語名_その他",
        "en_name": "Language_Other"
      },
      {
        "id": 121,
        "jp_name": "国語名",
        "en_name": "National_Language"
      },
      {
        "id": 122,
        "jp_name": "単位名_その他",
        "en_name": "Unit_Other"
      },
      {
        "id": 123,
        "jp_name": "通貨単位名",
        "en_name": "Currency"
      },
      {
        "id": 124,
        "jp_name": "イベント名_その他",
        "en_name": "Event_Other"
      },
      {
        "id": 125,
        "jp_name": "催し物名_その他",
        "en_name": "Occasion_Other"
      },
      {
        "id": 126,
        "jp_name": "例祭名",
        "en_name": "Religious_Festival"
      },
      {
        "id": 127,
        "jp_name": "競技会名",
        "en_name": "Game"
      },
      {
        "id": 128,
        "jp_name": "会議名",
        "en_name": "Conference"
      },
      {
        "id": 129,
        "jp_name": "事故事件名_その他",
        "en_name": "Incident_Other"
      },
      {
        "id": 130,
        "jp_name": "戦争名",
        "en_name": "War"
      },
      {
        "id": 131,
        "jp_name": "自然現象名_その他",
        "en_name": "Natural_Phenomenon_Other"
      },
      {
        "id": 132,
        "jp_name": "自然災害名",
        "en_name": "Natural_Disaster"
      },
      {
        "id": 133,
        "jp_name": "地震名",
        "en_name": "Earthquake"
      },
      {
        "id": 134,
        "jp_name": "自然物名_その他",
        "en_name": "Natural_Object_Other"
      },
      {
        "id": 135,
        "jp_name": "元素名",
        "en_name": "Element"
      },
      {
        "id": 136,
        "jp_name": "化合物名",
        "en_name": "Compound"
      },
      {
        "id": 137,
        "jp_name": "鉱物名",
        "en_name": "Mineral"
      },
      {
        "id": 138,
        "jp_name": "生物名_その他",
        "en_name": "Living_Thing_Other"
      },
      {
        "id": 139,
        "jp_name": "真菌類名",
        "en_name": "Fungus"
      },
      {
        "id": 140,
        "jp_name": "軟体動物_節足動物名",
        "en_name": "Mollusk_Arthropod"
      },
      {
        "id": 141,
        "jp_name": "昆虫類名",
        "en_name": "Insect"
      },
      {
        "id": 142,
        "jp_name": "魚類名",
        "en_name": "Fish"
      },
      {
        "id": 143,
        "jp_name": "両生類名",
        "en_name": "Amphibia"
      },
      {
        "id": 144,
        "jp_name": "爬虫類名",
        "en_name": "Reptile"
      },
      {
        "id": 145,
        "jp_name": "鳥類名",
        "en_name": "Bird"
      },
      {
        "id": 146,
        "jp_name": "哺乳類名",
        "en_name": "Mammal"
      },
      {
        "id": 147,
        "jp_name": "植物名",
        "en_name": "Flora"
      },
      {
        "id": 148,
        "jp_name": "生物部位名_その他",
        "en_name": "Living_Thing_Part_Other"
      },
      {
        "id": 149,
        "jp_name": "動物部位名",
        "en_name": "Animal_Part"
      },
      {
        "id": 150,
        "jp_name": "植物部位名",
        "en_name": "Flora_Part"
      },
      {
        "id": 151,
        "jp_name": "病気名_その他",
        "en_name": "Disease_Other"
      },
      {
        "id": 152,
        "jp_name": "動物病気名",
        "en_name": "Animal_Disease"
      },
      {
        "id": 153,
        "jp_name": "色名_その他",
        "en_name": "Color_Other"
      },
      {
        "id": 154,
        "jp_name": "自然色名",
        "en_name": "Nature_Color"
      },
      {
        "id": 155,
        "jp_name": "時間表現_その他",
        "en_name": "Time_Top_Other"
      },
      {
        "id": 156,
        "jp_name": "時間_その他",
        "en_name": "Timex_Other"
      },
      {
        "id": 157,
        "jp_name": "時刻表現",
        "en_name": "Time"
      },
      {
        "id": 158,
        "jp_name": "日付表現",
        "en_name": "Date"
      },
      {
        "id": 159,
        "jp_name": "曜日表現",
        "en_name": "Day_Of_Week"
      },
      {
        "id": 160,
        "jp_name": "時代表現",
        "en_name": "Era"
      },
      {
        "id": 161,
        "jp_name": "期間_その他",
        "en_name": "Periodx_Other"
      },
      {
        "id": 162,
        "jp_name": "時刻期間",
        "en_name": "Period_Time"
      },
      {
        "id": 163,
        "jp_name": "日数期間",
        "en_name": "Period_Day"
      },
      {
        "id": 164,
        "jp_name": "週数期間",
        "en_name": "Period_Week"
      },
      {
        "id": 165,
        "jp_name": "月数期間",
        "en_name": "Period_Month"
      },
      {
        "id": 166,
        "jp_name": "年数期間",
        "en_name": "Period_Year"
      },
      {
        "id": 167,
        "jp_name": "数値表現_その他",
        "en_name": "Numex_Other"
      },
      {
        "id": 168,
        "jp_name": "金額表現",
        "en_name": "Money"
      },
      {
        "id": 169,
        "jp_name": "株指標",
        "en_name": "Stock_Index"
      },
      {
        "id": 170,
        "jp_name": "ポイント",
        "en_name": "Point"
      },
      {
        "id": 171,
        "jp_name": "割合表現",
        "en_name": "Percent"
      },
      {
        "id": 172,
        "jp_name": "倍数表現",
        "en_name": "Multiplication"
      },
      {
        "id": 173,
        "jp_name": "頻度表現",
        "en_name": "Frequency"
      },
      {
        "id": 174,
        "jp_name": "年齢",
        "en_name": "Age"
      },
      {
        "id": 175,
        "jp_name": "学齢",
        "en_name": "School_Age"
      },
      {
        "id": 176,
        "jp_name": "序数",
        "en_name": "Ordinal_Number"
      },
      {
        "id": 177,
        "jp_name": "順位表現",
        "en_name": "Rank"
      },
      {
        "id": 178,
        "jp_name": "緯度経度",
        "en_name": "Latitude_Longitude"
      },
      {
        "id": 179,
        "jp_name": "寸法表現_その他",
        "en_name": "Measurement_Other"
      },
      {
        "id": 180,
        "jp_name": "長さ",
        "en_name": "Physical_Extent"
      },
      {
        "id": 181,
        "jp_name": "面積",
        "en_name": "Space"
      },
      {
        "id": 182,
        "jp_name": "体積",
        "en_name": "Volume"
      },
      {
        "id": 183,
        "jp_name": "重量",
        "en_name": "Weight"
      },
      {
        "id": 184,
        "jp_name": "速度",
        "en_name": "Speed"
      },
      {
        "id": 185,
        "jp_name": "密度",
        "en_name": "Intensity"
      },
      {
        "id": 186,
        "jp_name": "温度",
        "en_name": "Temperature"
      },
      {
        "id": 187,
        "jp_name": "カロリー",
        "en_name": "Calorie"
      },
      {
        "id": 188,
        "jp_name": "震度",
        "en_name": "Seismic_Intensity"
      },
      {
        "id": 189,
        "jp_name": "マグニチュード",
        "en_name": "Seismic_Magnitude"
      },
      {
        "id": 190,
        "jp_name": "個数_その他",
        "en_name": "Countx_Other"
      },
      {
        "id": 191,
        "jp_name": "人数",
        "en_name": "N_Person"
      },
      {
        "id": 192,
        "jp_name": "組織数",
        "en_name": "N_Organization"
      },
      {
        "id": 193,
        "jp_name": "場所数_その他",
        "en_name": "N_Location_Other"
      },
      {
        "id": 194,
        "jp_name": "国数",
        "en_name": "N_Country"
      },
      {
        "id": 195,
        "jp_name": "施設数",
        "en_name": "N_Facility"
      },
      {
        "id": 196,
        "jp_name": "製品数",
        "en_name": "N_Product"
      },
      {
        "id": 197,
        "jp_name": "イベント数",
        "en_name": "N_Event"
      },
      {
        "id": 198,
        "jp_name": "自然物数_その他",
        "en_name": "N_Natural_Object_Other"
      },
      {
        "id": 199,
        "jp_name": "動物数",
        "en_name": "N_Animal"
      },
      {
        "id": 200,
        "jp_name": "植物数",
        "en_name": "N_Flora"
      }
    ];
        
    var mini_kanji_url= "../public/app/db/kanjimini.json";
    var javi_fast_url = "../public/app/db/javifastdict.txt";
    var vija_fast_url = "../public/app/db/vijafastdict.txt";
        
    var miniKanjiDict = null;  
    var allJaviWords = null;
    var allVijaWords = null;    
    var autocomplete = localstoreServ.getItem('autocomplete');
    if (autocomplete == null) {
        autocomplete = true;
    }
        
    function loadMiniKanjiDict() {
        if (miniKanjiDict == null) {
            $.ajax({
                type: 'GET',
                url: mini_kanji_url,
                success: function (data, status, xhr) {
                    var kanjis = null;
                    if (typeof data == "string") {
                       kanjis = JSON.parse(data);
                    } else {
                        kanjis = data;
                    }
                    var kanjiDict = {};
                    for (var i = 0; i < kanjis.length; i++) {
                        kanjiDict[kanjis[i].w] = kanjis[i].h;
                    }

                    miniKanjiDict = kanjiDict;
                    if (autocomplete == true) {
                        loadJaviFastDict();
                    }
                },
                error: function (xhr, status, err) {
                   console.log("File not found: " + mini_kanji_url);
                },
            });
        }
    };

    function loadJaviFastDict() {
      if (allJaviWords == null) {
          $.ajax({
                type: 'GET',
                url: javi_fast_url,
                success: function (data, status, xhr) {
                    allJaviWords = data;
                    loadVijaFastDict();
                },
                error: function (xhr, status, err) {
                   console.log("File not found: " + javi_fast_url);
                }
            });
      }
    } 
        
    function loadVijaFastDict() {
      if (allVijaWords == null) {
          $.ajax({
                type: 'GET',
                url: vija_fast_url,
                success: function (data, status, xhr) {
                    allVijaWords = data;
                },
                error: function (xhr, status, err) {
                   console.log("File not found: " + vija_fast_url);
                }
            });
      }
    }         
        
    service.isVietnamese = function(keyword) {
        keyword = wanakana.toKana(keyword);
        var len = keyword.length;
        for (var i = 0; i < len; i++) {
            if (anphal.indexOf(keyword[i]) != -1) {
                return true;
            }
        }

        return false;
    };
        
    service.capitaliseFirstLetter = function(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    service.isJapanese = function (keyword) {
        var len = keyword.length;
        for (var i = 0; i < len; i++) {
            if (service.isKanji(keyword.charAt(i)) ||
                service.isHiragana(keyword.charAt(i)) ||
                service.isKatakan(keyword.charAt(i))) {
                return true;
            }
        }

        return false;
    };
        
    service.getKanjiChara = function(keyword) {

        if (keyword == null) {
            return '';
        }

        var result = '';
        var len = keyword.length;
        for (var i = 0; i < len; i++) {
            if (service.isKanji(keyword.charAt(i)) && 
                result.indexOf(keyword.charAt(i)) == -1) {
                result += keyword.charAt(i);
            }
        }
        
        return result;
    }

    service.isRomanji = function(c) {
        var charcode = c.charCodeAt(0);
        if (charcode >= 0x0020 && charcode <= 0x007e) {
            return true;
        }

        return false;
    }

    service.allHiragana = function(keyword) {
        var len = keyword.length;
        for (var i = 0; i < len; i++) {
            if (isHiragana(keyword.charAt(i)) == false) {
                return false;
            }
        }

        return true;
    }    
        
    service.isKanji = function(c) {
        if (c == '々') {
            return true;
        }

        var charcode = c.charCodeAt(0);
        if (charcode >= 0x4E00 && charcode <= 0x9FBF) {
            return true;
        }
        return false;
    };
    
    service.isHiragana = function(c) {
        var charcode = c.charCodeAt(0);
        if (charcode >= 0x3040 && charcode <= 0x309F) {
            return true;
        }

        return false;
    };

    service.isKatakan = function (c) {
        var charcode = c.charCodeAt(0);
        if (charcode >= 0x30A0 && charcode <= 0x30FF) {
            return true;
        }

        return false;
    };
    
        
    service.mergeKanjiAndHiragana = function (kanji, hiragana) {
        if (kanji == '' || hiragana == '' || kanji == null || hiragana == null)
            return null;

        if (service.isJapanese(kanji) == false || service.isJapanese(hiragana) == false) {
            return null;
        }

        var re = new RegExp(' ', 'g');

        if (kanji.indexOf(' ') != -1) {
            kanji = kanji.replace(re, '');
        }

        if (hiragana.indexOf(' ') != -1) {
            hiragana = hiragana.replace(re, '');
        }

        re = new RegExp('　', 'g');
        if (kanji.indexOf('　') != -1) {
            kanji = kanji.replace(re, '');
        }

        if (hiragana.indexOf('　') != -1) {
            hiragana = hiragana.replace(re, '');
        }

        var result = [];
        var currentKanji = '';
        var currentHiragana = '';
        var nextHiraganaChar = '';

        var j = 0;
        for (var i = 0; i < kanji.length; i++) {
            var c = kanji.charAt(i);
            if (service.isKanji(c) || service.isKatakan(c)) {
                if (currentKanji == '' && currentHiragana != '') {
                    var mergedObj = new Object();
                    mergedObj.k = currentHiragana;
                    mergedObj.h = '';
                    result.push(mergedObj);
                    currentHiragana = '';
                    j += currentHiragana.length;
                }
                currentKanji += c;
            } else {
                if (currentKanji == '') {
                    currentHiragana += c;
                    j++;
                } else {

                    nextHiraganaChar = c;
                    while (j < hiragana.length) {
                        if (service.getLengthHiragana(currentHiragana) < currentKanji.length ||
                            hiragana.charAt(j) != nextHiraganaChar) {
                            currentHiragana += hiragana.charAt(j);
                        } else if (hiragana.charAt(j) == nextHiraganaChar) {
                            var mergedObj = new Object();
                            mergedObj.k = currentKanji;
                            mergedObj.h = currentHiragana;

                            result.push(mergedObj);

                            currentKanji = '';
                            currentHiragana = c;
                            j++;
                            break;
                        }

                        j++;
                    }

                    if (j == hiragana.length && currentKanji != '') {
                        var mergedObj = new Object();
                        mergedObj.k = currentKanji;
                        mergedObj.h = currentHiragana;

                        result.push(mergedObj);
                    }

                    if (j == hiragana.length && i < kanji.length - 1) {
                        // this case is parse error
                        return null;
                    }
                }
            }
        }

        if (currentKanji != '') {
            while (j < hiragana.length) {
                currentHiragana += hiragana.charAt(j);
                j++;
            }

            var mergedObj = new Object();
            mergedObj.k = currentKanji;
            mergedObj.h = currentHiragana;

            result.push(mergedObj);
        } else if (currentHiragana != '') {
            var mergedObj = new Object();
            mergedObj.k = currentHiragana;
            mergedObj.h = '';
            result.push(mergedObj);
        }

        return result;
    };
        
    service.getLengthHiragana = function(kanji) {
        if (kanji == null || kanji.length == 0) {
            return 0;
        }

        var result = 0;
        for (var i = 0; i < kanji.length; i++) {
            var c = kanji.charAt(i);
            if (c == 'ん' ||
                c == 'ぁ' ||
                c == 'ぃ' ||
                c == 'ぇ' ||
                c == 'ぅ' ||
                c == 'ぉ' ||
                c == 'ゅ' ||
                c == 'ょ') {
                continue;
            }

            result++;
        }

        return result;
    }

    service.removeJapaneseChar = function(data) {
        if (data == null)
            return '';

        var result = '';
        for (var i = 0; i < data.length; i++) {
            if (service.isJapanese(data[i]) || 
               data[i] == '～' || 
               data[i] == '、' ||
               data[i] == '　' ||
               data[i] == ':' || 
               data[i] == '：' ||
               data[i] == '（' ||
               data[i] == '。' || 
               data[i] == '）') {
                continue;
            }

            result += data[i];
        }
        
        result = result.trim();
        return result;
    }
    
    var tableConjugationConvert = {

    //  0           1       2       3       4       5           6           7       8                           9           10
    //  end with, past, negative, i form, te form, potential, passive, causative, Provisional Conditional, Imperative, Volitional   

        /*"aux-i": [
            "だ", "だった", "じゃない", "であり", "で", "", "", "", "であれば", "であれ", "だろう"
        ],

        "aux-p": [
            "です", "ですた", "じゃありません", "であり", "", "", "", "", "", "", "でしょう"
        ],

        "masu": [
            "ます", "ました", "", "", "まして", "", "", "", "", "", "ましょう"
        ],*/

        "vs": [
            "する", "した", "しない", "し", "して", "できる", "される", "させる", "すれば", "しろ", "しよう"
        ],
        "vk": [
            "くる", "きた", "きない", "き", "きて", "来られる", "来られる", "来させる", "くれば", "こい", "こよう"
        ],
        "v5u": [
            "う", "った", "わない", "い", "って", "える", "われる", "わせる", "えば", "え", "おう"
        ],
        "v5u-s": [
            "う", "うた", "わない", "い", "うて", "える", "われる", "わせる", "えば", "え", "おう"
        ],
        "v5k": [
            "く", "いた", "かない", "き", "いて", "ける", "かれる", "かせる", "けば", "け", "こう"
        ],
        "v5k-s": [
            "く", "った", "かない", "き", "って", "ける", "かれる", "かせる", "けば", "け", "こう"
        ],
        "v5g": [
            "ぐ", "いだ", "がない", "ぎ", "いで", "げる", "がれる", "がせる", "げば", "げ", "ごう"
        ],
        "v5s": [
            "す", "した", "さない", "し", "して", "せる", "される", "させる", "せば", "せ", "そう"
        ],
        "v5t": [
            "つ", "った", "たない", "ち", "って", "てる", "たれる", "たせる", "てば", "て", "とう"
        ],
        "v5n": [
            "ぬ", "んだ", "なない", "に", "んで", "ねる", "なれる", "なせる", "ねば", "ね", "のう"
        ],
        "v5b": [
            "ぶ", "んだ", "ばない", "び", "んで", "べる", "ばれる", "ばせる", "べば", "べ", "ぼう"
        ],
        "v5m": [
            "む", "んだ", "まない", "み", "んで", "める", "まれる", "ませる", "めば", "め", "もう"
        ],
        "v5r": [
            "る", "った", "らない", "り", "って", "れる", "られる", "らせる", "れば", "れ", "ろう"
        ],
        "v5r-i": [
            "る", "った", "", "り", "って", "ありえる", "", "らせる", "れば", "れる", "ろう"
        ],
        "v5aru": [
            "る", "った", "らない", "い", "って", "りえる", "", "", "", "い", ""
        ],
        "v1": [
            "る", "た", "ない", "-", "て", "られる", "られる", "させる", "れば", "いろ", "よう"
        ]

        /*"adj-i": [
            "い", "かった", "くない", "くて", "", "", "", "", "ければ", "", "かろう"
        ],
        "adj-na": [
            "な", "だった", "ではない", "で", "", "", "", "", "であれば", "", "だろう"
        ]*/
    }

    service.getConjugationTableOfVerb = function(dictVerb, phonetic, type) {

        // normalize phonetic

        if (phonetic == null) {
            phonetic = null;
        } else {
            if (phonetic.indexOf("「") != -1) {
                phonetic = phonetic.replace("「", "");
                phonetic = phonetic.replace("」", "");
            }    
        }
        
        // check type is in table
        var rule = tableConjugationConvert[type];
        if (rule == null)
            return null;

        phonetic = phonetic.split(" ")[0];
        
        // check base form
        if (dictVerb.indexOf(rule[0]) == -1) {
            dictVerb = dictVerb + rule[0];
            phonetic = phonetic + rule[0];
        }

        
        var verbConjug = {};
        verbConjug.base = {};
        verbConjug.base.word = dictVerb + "/" + phonetic;
        verbConjug.base.name = "Dictionary (辞書)"

        if (dictVerb == phonetic) {
            verbConjug.base.word = dictVerb;
        }

        var regex = new RegExp(rule[0] + "$");

        // get past form
        verbConjug.past = {};
        verbConjug.past.word = dictVerb.replace(regex, rule[1]);
        verbConjug.past.name = "Past (た)"

        // get nagative form
        if (rule[2] != "") {
            verbConjug.nagative = {};
            verbConjug.nagative.word = dictVerb.replace(regex, rule[2]);
            verbConjug.nagative.name = "Negative (未然)";
        } else {
            verbConjug.nagative = {};
            if (dictVerb.indexOf("する") != -1) {
                verbConjug.nagative.word = dictVerb.replace("する", "しない");
            } else if (dictVerb.indexOf("くる") != -1) {
                verbConjug.nagative.word = dictVerb.replace("くる", "こない")
            }

            verbConjug.nagative.name = "Negative (未然)";
        }

        // get polite form
        if (rule[3] != "") {
            verbConjug.polite = {};
            if (rule[3] == "-") {
                verbConjug.polite.word = dictVerb.replace(regex, "") + "ます"; 
            } else {
                verbConjug.polite.word = dictVerb.replace(regex, rule[3]) + "ます"; 
            }
            verbConjug.polite.name = "Polite (丁寧)";
        }

        // get te form
        if (rule[4] != "") {
            verbConjug.te = {};
            verbConjug.te.word = dictVerb.replace(regex, rule[4]);
            verbConjug.te.name = "te (て)"
        }


        // get potential form
        if (rule[5] != "") {
            verbConjug.potential = {};
            verbConjug.potential.word = dictVerb.replace(regex, rule[5]);
            verbConjug.potential.name = "Able (可能)";
        }

        // get passive form
        if (rule[6] != "") {
            verbConjug.passive = {};
            verbConjug.passive.word = dictVerb.replace(regex, rule[6]);
            verbConjug.passive.name = "Passive (受身)";
        }


        // get causative form
        if (rule[7] != "") {
            verbConjug.causative = {};
            verbConjug.causative.word = dictVerb.replace(regex, rule[7]);
            verbConjug.causative.name = "Inducement (使役)";
        } 

        if (rule[6] != "" && rule[7] != "") {
            var caupassRule = tableConjugationConvert["v1"];
            var caupassRegex = new RegExp(caupassRule[0] + "$");

            verbConjug.cau_pass = {};
            verbConjug.cau_pass.word = verbConjug.causative.word.replace(caupassRegex, rule[6]);
            verbConjug.cau_pass.name = "Passive inducement (使役受身)";
        }

        // get conditional form
        if (rule[8] != "") {
            verbConjug.conditional = {};
            verbConjug.conditional.word = dictVerb.replace(regex, rule[8]);
            verbConjug.conditional.name = "Proviso (条件)";
        }


        // get imperative form
        if (rule[9] != "") {
            verbConjug.imperative = {};
            verbConjug.imperative.word = dictVerb.replace(regex, rule[9]);
            verbConjug.imperative.name = "Dictates (命令)";
        }


        // get volitional form
        if (rule[10] != "") {
            verbConjug.volitional = {};
            verbConjug.volitional.word = dictVerb.replace(regex, rule[10]);
            verbConjug.volitional.name = "Volition (意向)";
        }

        verbConjug.prohibition = {};
        verbConjug.prohibition.word = dictVerb + "な";
        verbConjug.prohibition.name = "Interdict(禁止)";

        return verbConjug;
    }
    
    service.convertKindToReadable = function(kind) {
    
        var kinds = [];
        if (kind.indexOf(',') != -1) {
            kinds = kind.split(',');
            for (var i = 0; i < kinds.length; i++) {
                kinds[i] = kinds[i].trim();
            }
        } else {
            kinds.push(kind);
        }

        var result = '';
        for (var i = 0; i < kinds.length; i++) {
            if (kindTables.hasOwnProperty(kinds[i])) {
                result += kindTables[kinds[i]];
            } else {
                result += kinds[i];
            }

            if (i != kinds.length - 1) {
                result += ", ";
            }
        }

        return result;
    }
    
    function getFirstWord(data) {
        var v1 = data.split(',')[0];
        return v1.split(';')[0];
    }
    
    service.getHVOfKey = function(keyword) {
        if (keyword == null ||
           keyword.length >= 5) {
            return "";
        }

        if (miniKanjiDict == null)
            return "";

        var result = "";
        for (var i = 0; i < keyword.length; i++) {
            if (service.isKanji(keyword[i])) {
                var hv = miniKanjiDict[keyword[i]];
                if (hv != null) {
                    if (result != "") {
                        result += " ";
                    }
                    result += getFirstWord(hv);
                }
            }
        }

        return result;
    }
    
    service.sortHVDataByKeyWord = function (kw, datas) {
        var newDatas = new Array();
        var count = 0;

        for (var i = 0; i < kw.length; i++) {
            for (var j = 0; j < datas.length; j++) {
                if (kw[i] == datas[j].kanji) {

                    var exist = false;
                    // check this key is exist in new datas
                    for (var k = 0; k < newDatas.length; k++) {
                        if (newDatas[k].kanji == kw[i]) {
                            exist = true;
                            break;
                        }
                    }

                    if (exist == false) {
                        newDatas[count] = datas[j];
                        count++;
                    }
                }
            }
        }

        return newDatas;
    }
    
    service.realtimeSearch = function(fastdict, query) {
        var dict = allJaviWords;
        var searchJapanese = true;
        if (fastdict == "vi") {
            dict = allVijaWords;
            searchJapanese = false;
        }
        
        var result = null;
        var queryLen = query.length;
        var rx = new RegExp('"([^"]*'+query+'[^"]*)"','gi');
        var i = 0, results = [];
        var max_diff_len = 4;
        if (queryLen > 4) {
            max_diff_len = 16;
        } else if (queryLen > 6) {
            max_diff_len = 20;
        }

        while (result = rx.exec(dict)) {
            
            var word = result[1];
            var str1 = '';
            if (searchJapanese) {
                var arr = word.split(" ");
                var str1 = arr[0];
                var k = 0;
                while (k < arr.length && str1.indexOf(query) == -1) {
                    k++;
                    str1 = arr[k];
                }
                
                if (str1.length - queryLen > max_diff_len) {
                    continue;
                }
            } else {
                str1 = word;
                if (str1.length - queryLen > max_diff_len) {
                    continue;
                }
            }
            
            if (str1 == query) {
                results.splice(0, 0, word);
            } else {
                results.push(word);
            }
            
            i += 1;
            if (i >= 150)
              break;
        }

        // get 20 first item
        var finalResults = [];
        for (var i = 0; i < 30 && i < results.length; i++) {
            finalResults.push(results[i]);
        }
        
        return finalResults;
    }

    service.sortResultSuggest = function(suggestList, keyword) {

        if (suggestList == null)
            return null;

        var leng = suggestList.length;
        for (var i = 0; i < leng; i++) {
            for (var j = i + 1; j < leng; j++) {  
            }
        }
    }

    service.convertStrToInt = function(str) {
        if (str == null)
            return 0;
        var r = 0;
        var i = str.length - 1;
        var iter = 1;
        while (i >= 0) {
            r += str.charCodeAt(i) * iter;
            i--;
            iter *= 10;
        }
        return r;
    }    
    
    
    service.generateSuggest = function (listSuggests, clickHandler) {
        
        if (listSuggests == null || listSuggests.length == 0)
            return '';
        
        var itemTemplate = '<div class="item suggest" ng-click="suggestClick({{item}})"><span><b>{{ item.split(" ")[0] }}</b> {{ item.replace(item.split(" ")[0], "") }} </span></div>';
        
        var templates = '<div class="list">';
        var miniScope = {
                item: '',
                suggestClick: clickHandler
            };
        for (var i = 0; i < listSuggests.length; i++) {
            miniScope.item = listSuggests[i];
            templates += $interpolate(itemTemplate)(miniScope);
        }
        
        templates += "</div>";
        
        return templates;
    } 

    service.closePanel = function () {
        $('.menu-left').removeClass('open-menu-left');
        $('.history-panel').removeClass('open-history-panel');
        $('.setting-panel').removeClass('open-setting-panel');
        $('.cover').css('display', 'none'); 
        $('body').css('overflow', 'auto');
    }

    service.showTitlePage = function () {
        $('.title-page').removeClass('hidden-title');
    }

    service.hiddenTitlePage = function () {
        $('.title-page').addClass('hidden-title');
    }

    service.checkExistNewlineinMessage = function (message) {
        return message.content.indexOf('\n');
    }

    service.renderHtmlMessage = function (message) {
        return message.content.split('\n');
    }

    service.renderHtmlMessagePrivate = function (message) {
        return message.message.split('\n');
    }

    service.renderHtmlListMessage = function (listMessage) {
        var size = listMessage.length;
        for (var i = 0; i < size; i++) {
            var msg = service.renderHtmlMessage(listMessage[i]);
            if (msg.length > 1) {
                listMessage[i].newLine = true;
                listMessage.content = msg;
            }
        }
        return listMessage;
    }

    service.safeApply = function (scope) {
        var phase = scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {

        } else {
            scope.$digest();
        }
    }

    service.getDataSurvay = function ()  {
        var deferred = $q.defer();
        
        $http.get('db/survay.json')
        .success(function (data, status, headers, config) {
            return deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
            return deferred.resolve(null);
        });

        return deferred.promise;
    }

    service.shuffleArray = function(array) {
        var m = array.length, t, i;

          // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    service.getAffilate = function () {
        var deferred = $q.defer();
        var Affilate = Parse.Object.extend("affilate");
        var query = new Parse.Query(Affilate);

        query.equalTo("running", true);
        query.descending("priority");
        query.limit(3);
        query.find().then(function(result) {
            var list = [];
            for (var i = 0; i < result.length; i++) {
                // Chuyển quảng cáo về dạng chuẩn
                var data = result[i]._serverData;                
                data.link = [];
                if (typeof data.code300_1 != 'undefined' && data.code300_1 != null) {
                    data.link.push(data.code300_1);
                }

                if (typeof data.code300_2 != 'undefined' && data.code300_2 != null) {
                    data.link.push(data.code300_2);
                }

                if (typeof data.code300_3 != 'undefined' && data.code300_3 != null) {
                    data.link.push(data.code300_3);
                }

                if (typeof data.code300_4 != 'undefined' && data.code300_4 != null) {
                    data.link.push(data.code300_4);
                }

                // Trộn quảng cáo
                service.shuffleArray(data.link);
                list.push(data);
            }
            return deferred.resolve(list);
        });

        return deferred.promise;
    }
    service.getCurrentTime = function () {
        var d = new Date();
        var month = d.getMonth() + 1;
        return d.getSeconds() + '/' + d.getMinutes() + '/' + d.getHours() + '/' + d.getDate() + '/' + month + '/' + d.getFullYear();
    }


    // Convert ký tự | thành ,
    service.convertNice = function (str) {
        var size = str.length;
        var result = '';
        for (var i = 0; i < size; i++) {
            if (str.charAt(i) == '|') 
                result += ' , ';
            else
                result += str.charAt(i);
        }

        return result;
    }
    
    // Convert thành bộ trong kanji
    service.convertBoKanji = function (str) {
        return str.split('|')[0].split(' ')[0];
    }   

    service.convertJptoHex = function (jp) {
        if (jp == null || jp == "") {
            return "";
        }
        
        if (jp.indexOf('「') != -1) {
            jp = jp.replace(new RegExp('「', 'g'), '');
            jp = jp.replace(new RegExp('」', 'g'), ''); 
        }
        
        jp = jp.trim();
        var result = '';
        
        for (var i = 0; i < jp.length; i++) {
            result += ("0000" + jp.charCodeAt(i).toString(16)).substr(-4);
            if (i != jp.length - 1) {
                result += "_";
            }
        }
        
        return result;
    }

    loadMiniKanjiDict();
    
     service.getLevelOfCategory = function (categoryName) {
         
         if (categoryName == '')
             return '';
         
         categoryName = categoryName.toLowerCase().capitalizeFirstLetter();
         for (var i = 0; i < categoryName.length; i++) {
             if (categoryName[i - 1] == '_') {
                 categoryName = categoryName.replace('_' + categoryName[i], '_' + categoryName[i].toUpperCase());
             }
         }
         
         var rootLevel = altLevelDict.level_3_1_en[categoryName];
         var secondLevel = altLevelDict.level_3_2_en[categoryName];
         
         if (rootLevel == null)
             return categoryName;
         
         if (secondLevel == null) {
             return rootLevel.replace(/_/g, ' ').toLowerCase().capitalizeFirstLetter() + "  >  " + categoryName.replace(/_/g, ' ').capitalizeFirstLetter();
         } else {
             return rootLevel.replace(/_/g, ' ').toLowerCase().capitalizeFirstLetter() + "  >  " + secondLevel.replace(/_/g, ' ').toLowerCase().capitalizeFirstLetter() + "  >  " + categoryName.replace(/_/g, ' ').capitalizeFirstLetter();
         }
     }
     
     String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
     
     return service;    
}]);
