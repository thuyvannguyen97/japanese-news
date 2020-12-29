function isKanji (c) {
    if (c == '々') {
        return true;
    }

    var charcode = c.charCodeAt(0);
    if (charcode >= 0x4E00 && charcode <= 0x9FBF) {
        return true;
    }
    return false;
};

function isHiragana (c) {
    var charcode = c.charCodeAt(0);
    if (charcode >= 0x3040 && charcode <= 0x309F) {
        return true;
    }

    return false;
};

function isKatakan (c) {
    var charcode = c.charCodeAt(0);
    if (charcode >= 0x30A0 && charcode <= 0x30FF) {
        return true;
    }

    return false;
};

function isJapanese (keyword) {
    var len = keyword.length;
    for (var i = 0; i < len; i++) {
        if (isKanji(keyword.charAt(i)) ||
            isHiragana(keyword.charAt(i)) ||
            isKatakan(keyword.charAt(i))) {
            return true;
        }
    }

    return false;
};

var anphal = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
function isVietnamese(keyword) {
    keyword = wanakana.toKana(keyword);
    var len = keyword.length;
    for (var i = 0; i < len; i++) {
        if (anphal.indexOf(keyword[i]) != -1) {
            return true;
        }
    }

    return false;
};

function getLengthHiragana (kanji) {
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

function mergeKanjiAndHiragana (kanji, hiragana) {
    if (kanji == '' || hiragana == '' || kanji == null || hiragana == null)
        return null;

    if (isJapanese(kanji) == false || isJapanese(hiragana) == false) {
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
        if (isKanji(c) || isKatakan(c)) {
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
                    if (getLengthHiragana(currentHiragana) < currentKanji.length ||
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