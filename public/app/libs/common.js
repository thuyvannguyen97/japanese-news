var admobid = null;
var appConfig = null;
var isTestVersion = false;
var LASTEST_CLICK_ADS = "lastest_clicked_ads";
var removedAds = false;

function startAppConfig() {
    loadAppConfig(function (ac) {
        if (ac == null)
            return;
        
        if (typeof ac == "string") {
            appConfig = JSON.parse(ac);
        } else {
            appConfig = ac;
        }
        
        initGA(appConfig.ga);
        initAds(appConfig.adsid);
        createBannerAd();
    });
}

function loadAppConfig(callback) {
    // request from server first
    var urlRq = "http://eup.mobi/apps/mazii/config2.json?" + Date.now();
    if (isTestVersion == true) {
        urlRq = "test_config.json"
    }
    
    $.ajax({
        type: 'GET',
        cache: false,
        url: urlRq,
        success: function (data, status, xhr) {
            if (data != null) {
                if (callback != null) { 
                    saveConfig(data);
                    callback(data);
                }
            } else {
                // get from cache
                getConfigFromCache(callback);
            }
        },
        error: function (xhr, status, err) {
            // get from cache
            getConfigFromCache(callback);
        }
    });    
}

function initGA(ga) {
    if (typeof analytics != "undefined")
    {
        // init google analystic
        if( /(android)/i.test(device.platform) ) {
            analytics.startTrackerWithId(ga.android);
        } else if(/(ios)/i.test(device.platform)) {
            analytics.startTrackerWithId(ga.ios);
        } else {
            analytics.startTrackerWithId(ga.wp);
        }
    }
}

function sendGA(category, subcategory, label, value) {
    if (typeof ga == "undefined")
        return;
    
    ga("send", "event", category, subcategory, label, value);
}

function sendGA(category, label, value) {
    if (typeof ga == "undefined")
        return;
    
    ga("send", "event", category, label, value);
}


function trackView(view) {
    if (typeof analytics == "undefined")
        return;
    analytics.trackView(view);
}

function trackEvent(category, subcategory, label, value) {
    if (typeof analytics == "undefined")
        return;
    
    analytics.trackEvent(category, subcategory, label, value);
}



var adBannerAvailable = false;
var adInterstitialAvailable = false;
var bannerShowing = false;
var pressAdsInter = false;
var timeViewAds = null;
var timePressAds = null;

function adShowable() {
    
    var lastestTimeClicked = getLastestCickedAds();
    if (lastestTimeClicked != null) {
        lastestTimeClicked = new Date(lastestTimeClicked);
        var now = Date.now();
        if (now - lastestTimeClicked < appConfig.adsProb.adpress) {
            return false;
        }
    }
    
    return !removedAds;
}

function isShowAdsBannerByProb() {

    if (appConfig == null)
        return false;
    
    var r = Math.random();
    if (r < appConfig.adsProb.banner) {
        return true;
    }

    return false;
}

function isShowAdsInterByProb() {

    if (appConfig == null)
        return false;
    
    var r = Math.random();
    if (r < appConfig.adsProb.interstitial) {
        return true;
    }

    return false;
}

function initAds(ad_units) {
    
    if (typeof device === 'undefined') {
        return;
    }
    
    if( /(android)/i.test(device.platform) ) {
        admobid = ad_units.android;
    } else if(/(ios)/i.test(device.platform)) {
        admobid = ad_units.ios;
    } else {
        admobid = ad_units.wp8;
    }
    
    var defaultOptions = {
        bannerId: admobid.banner,
        interstitialId: admobid.interstitial,
        adSize: 'SMART_BANNER',
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: false
    };
    
    if (AdMob)
        AdMob.setOptions( defaultOptions );
    
    registerAdEvents();
}

function registerAdEvents() {
    document.addEventListener('onAdFailLoad', function (data) {
        if(data.adType == 'banner') {
            AdMob.hideBanner();
            adBannerAvailable = false;
        } else if (data.adType == 'interstitial') {
            adInterstitialAvailable = false;
        }
        //console.log("Admob event: " + JSON.stringify(data));
    });
    document.addEventListener('onAdLoaded', function (data) {
        if(data.adType == 'banner') {
            adBannerAvailable = true;
            if (bannerShowing == true) {
                showAdBanner(true);
            }
        } else if (data.adType == 'interstitial') {
            adInterstitialAvailable = true;
        }
        //console.log("Admob event: " + JSON.stringify(data));
    });

    document.addEventListener('onAdPresent', function (data) {
        if (data.adType == 'interstitial') {
            timeViewAds = new Date();
        }
        
    });
    document.addEventListener('onAdLeaveApp', function (data) {
        saveTimeClickAds();
        showAdBanner(false);
        trackEvent("ads", "click", device.platform);
    });

    document.addEventListener('onAdDismiss', function (data) {
        if (data.adType == 'interstitial') {
            
            // check time view ads
            var currentTime = new Date();
            if (currentTime - timeViewAds > 10000) {
                var event = new Event("viewAdsInter");
                window.dispatchEvent(event);
            }
            
            adInterstitialAvailable = false;
            prepareAdInters();
        }
        //console.log("Admob event: " + JSON.stringify(data));
    });

}

function createBannerAd() {
    if (typeof AdMob === 'undefined') {
        return;
    }
    
    if(AdMob && !removedAds) {
        AdMob.createBanner( {
            adId:admobid.banner,
            position:AdMob.AD_POSITION.BOTTOM_CENTER, 
            autoShow:false
        });
        prepareAdInters();
    }
        
    
}

function prepareAdBanner() {
    if( /(android)/i.test(device.platform) &&
        device.version.search('4.1') == 0) {
        return;
    }   
}

function showAdBanner(show) {

    if (typeof AdMob === 'undefined') {
        return;
    }
    
    if (show == true) {
        if(AdMob && 
            adShowable() && 
            isShowAdsBannerByProb()) {

            if (adBannerAvailable == true)
                AdMob.showBannerAtXY(0, 0);
            
            bannerShowing = true;
        } 
    } else {
        bannerShowing = false;
        if(AdMob) AdMob.hideBanner();
    }
}


function prepareAdInters() {
    if (typeof AdMob === 'undefined') {
        return;
    }
    
    if(AdMob && admobid) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
}


var lastestTimeShowIntersAd;
function showAdInters() {
    
    if (typeof AdMob === 'undefined') {
        return;
    }
    
    if (lastestTimeShowIntersAd == null &&
       adInterstitialAvailable == false) {
        prepareAdInters();
    }
    
    if (adShowable() && 
        adInterstitialAvailable == true && 
        isShowAdsInterByProb())
        if(AdMob) {
            
            if (lastestTimeShowIntersAd != null) {
                var now = Date.now();
                var miliSeconds = now - lastestTimeShowIntersAd;
                if (miliSeconds < appConfig.adsProb.intervalAdsInter) {
                    return;
                }
            }
            
            lastestTimeShowIntersAd = Date.now();
            AdMob.showInterstitial();
            return true;
        } 

    return false;
}

function forceShowAdInters() {
    if (typeof AdMob === 'undefined') {
        return;
    }
    
    if (adInterstitialAvailable == false) {
        prepareAdInters();
    } else {
        AdMob.showInterstitial();
        timeViewAds = new Date();
    }
    
    
}

function saveTimeClickAds() {
    var now = Date.now();
    setCacheItem(LASTEST_CLICK_ADS, now);
}

function getLastestCickedAds() {
    return getCacheItem(LASTEST_CLICK_ADS);
}

function isRemoveAds() {
    return removedAds;
}

//// Feedback
function feedback() {
    cordova.plugins.email.isAvailable(
        function (isAvailable) {
            if (isAvailable) {
                cordova.plugins.email.open({
                    to:      'support@mazii.net',
                    subject: 'Góp ý Mazii'
                });
            } else {
                // if email is not available then jump to rating app
                ratingApp();
            }
        }
    );
}


//// RATING
function ratingApp() {
    window.open(getRateUrl(), "_system");
}

function getRateUrl() {
    if( /(android)/i.test(device.platform) ) {
        return "market://details?id=com.mazii.dictionary";
    } else if(/(ios)/i.test(device.platform)) {
        return "itms-apps://itunes.apple.com/app/id933081417";
    } else {
        return "";
    }
}

//// FACEBOOK
function shareApp() {
    
    var linkShare = "http://mazii.net";
    if( /(android)/i.test(device.platform) ) {
        linkShare = "https://play.google.com/store/apps/details?id=com.mazii.dictionary";
    } else if(/(ios)/i.test(device.platform)) {
        linkShare = "https://itunes.apple.com/app/apple-store/id933081417";
    }
    
    /*facebookConnectPlugin.showDialog(
        {
            method: "share",
            href: linkShare
        }, function (success) {
            console.log("share success: " + JSON.stringify(success));
        }, function (error) {
            console.log("share failed: " + JSON.stringify(error));
        });*/
    window.plugins.socialsharing.share(linkShare);
}

//////////////////////////////////////////////////////////////////////////
// Data in local

function saveConfig(appConfig) {
    setCacheItem("APP_CONFIG", appConfig);
}

function getConfigFromCache(callback) {
    var appConfig = getCacheItem("APP_CONFIG");
    if (appConfig != null)
        callback(appConfig);
}

function getCacheItem(key) {
    if (typeof localStorage == "undefined")
        return null;

    var result = localStorage.getItem(key);
    return angular.fromJson(result);
}

function setCacheItem(key, value) {
    if (typeof localStorage == "undefined")
        return;

    localStorage.setItem(key, angular.toJson(value));
}

function clearCache() {
    if (typeof localStorage == "undefined")
        return;
    localStorage.clear();
}

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


function failFile(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function write_file(fileHandler, str) {
	if(!fileHandler) return;
	fileHandler.createWriter(function(fileWriter) {
        var blob = null;
        try {
            blob = new Blob([str], {type:'text/plain'});
		    
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(str);
                blob = bb.getBlob('text/plain');
                console.debug("case 2");
            }
            else if (e.name == "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                blob = new Blob([str], {type:'text/plain'});
                console.debug("case 3");
            }
            else {
                // We're screwed, blob constructor unsupported entirely   
                console.debug("Error");
            }
        }
        
        blob && fileWriter.write(blob);
		//console.log("write done");
	}, failFile);
}

function read_file(fileHander, callback) {
    if(!fileHander) {
        callback(null);
    }
    
    fileHander.file(function(file) {
		var reader = new FileReader();
		reader.onloadend = function(e) {
			callback(e.target.result);
		};
		reader.readAsText(file);
	}, function (e) {
        failFile(e);
        callback(null);
    });
}

function writeFile(fileName, subFolder, str) {
    if (typeof cordova === 'undefined') {
        return;
    }
    
    var path = cordova.file.dataDirectory;
    if (subFolder != null) {
        path = cordova.file.dataDirectory + subFolder;
    }
    
    window.resolveLocalFileSystemURL(path, function(dir) {
		dir.getFile(fileName, {create:true}, function(file) {
			write_file(file, str);			
		});
	});
}

function readFile(fileName, subFolder, callback) {
    if (typeof cordova === 'undefined') {
        return;
    }
    
    var path = cordova.file.dataDirectory;
    if (subFolder != null) {
        path = cordova.file.dataDirectory + subFolder;
    }
    
    window.resolveLocalFileSystemURL(path, function(dir) {
		dir.getFile(fileName, {create:false}, function(file) {
			read_file(file, callback);			
		}, function (err) {
            callback(null);
        });
	});
}
