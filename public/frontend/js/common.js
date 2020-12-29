$(function() {
    $('audio,video').mediaelementplayer({
        // automatically create these translations on load
        translations:['es','ar','yi','zh-cn'],
        // allow the user to add additional translations
        translationSelector: true,
        // start with English automatically turned on
        startLanguage: 'en',
        audioWidth: 620
    });



});
function openContent(){
    $("#audio-player").toggle();
}
function hideText(){
    $(".change").html("<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>をつける");
    $("rt").css('visibility', 'hidden');
    $(this).one("click",showText);
}
function showText() {
    $(".change").html("<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>を<ruby>消<rt>け</rt></ruby>す");
    $("rt").css('visibility', 'visible');
    $(this).one("click",hideText);
}
$("#change").one("click",hideText);

var pull        = $('#pull');
    menu        = $('#nav');
    menuHeight  = menu.height();

$("#pull").on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
});

function resFound(res){
    var string = [];
    var a;
    // console.log(res);
    $('.box-content').html('');
    if(res.found){

            var kanji = res.result[0].word;
            var hira  = res.result[0].phonetic;
            var boxHtml = '';
            boxHtml += `<div class="">
                        <div class="kanji">` + kanji + `</div>`;
            boxHtml += `<div class="hira">` + hira + `</div>`;

            $.each(res.result[0].means, function(index, item){
                let tagMean = '';
                if(item[0].kind != ''){
                    tagMean +=  `<div class="kind">   &#9679; ` + item[0].kind + `</div>`;
                }

                $.each(item, function(i, val){
                    html = `<p class = "mean-detail-modal">&#8227; ` + val.mean + `</p>`;
                     if (val.examples != null) {
                        $.each(val.examples, function(x, y){
                            var content  = y.content;
                            var meanExam = y.mean;
                            var trans    = y.transcription;
                            var tmpDt    = mergeKanjiAndHiragana(content, trans);
                            var newDt    = '';
                            if(tmpDt && tmpDt.length > 0) {
                                var tmpDt = Object.keys(tmpDt).map(function (key) { return tmpDt[key]; });
                                for(var m = 0; m < tmpDt.length; m++) {

                                    var kanji1 = tmpDt[m].k;
                                    var hira1 = tmpDt[m].h;
                                    if(hira1) {
                                        newDt += '<ruby >' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                    } else {
                                        newDt += '<ruby>' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                    }
                                }
                                html  += `<p>` + newDt + `</p>`;

                            }else if(tmpDt == null){
                                html  += `<p>` + content + `</p>`;
                            }

                           html  += `<p>` + meanExam + `</p>`;
                        })
                    }
                })
                var meanShow = `<div class="box-mean">
                                    <div class="box-mean-show">`+html+`</div>
                                </div>`;
                boxHtml += tagMean;
                boxHtml += meanShow;
            });
            boxHtml += `</div>`;
            $('.box-content').append(boxHtml);
        
    }else{
        $('.box-content').html('');
    }
    
}

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
       $('#input-search').click();
    }
}

// setting font-size
var nameClass = localStorage.getItem('nameClass');
var sizeChange = localStorage.getItem('sizeChange');

if (nameClass == null) {
    $('.size-options').val('80%');
    $('.size-options-mb').val('80%');
    $('#body').addClass('size-80');
}
else{
    $('.size-options').val(sizeChange);
    $('.size-options-mb').val(sizeChange);
    $('#body').addClass(nameClass);
}

function setSize(sizeChange) {
    if(sizeChange == '50%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-50');
    }
    if(sizeChange == '60%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-60');
    }
    if(sizeChange == '70%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-70');
    }
    if(sizeChange == '80%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-80');
    }
    if(sizeChange == '90%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-90');
    }
    if(sizeChange == '95%'){
        $('#body').removeClass(body.className);
        $('#body').addClass('size-95');
    }
}

$(".size-options").on('change', function(){
    var sizeChange = $(".size-options option:selected").attr('value');
    var body = document.getElementById('body');
    setSize(sizeChange);
    localStorage.setItem('nameClass', body.className);
    localStorage.setItem('sizeChange', sizeChange)
    
});
$(".size-options-mb").on('change', function(){
    var sizeChange = $(".size-options-mb option:selected").attr('value');
    var body = document.getElementById('body');
    setSize(sizeChange);
    localStorage.setItem('nameClass', body.className);
    localStorage.setItem('sizeChange', sizeChange)
    
});

//
$(".item-language").css('display','none');
$( "language_action" ).toggleClass( "item-language" );
$(".language_action").on('click', function(){
    $(".item-language").css('display','block');
})

//language localstorate

$.ajax({
    url: 'locale',
    type: 'GET',
    data: {
        locale :'vi'
    },
    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
    success: function(res){
        
    }
});
 
// setting disable furigana
function clickDict(url) {
    $('.dicWin').on('click', function(){
        var str = $(this)[0].innerHTML;
        var hira = str.replace(/<.*?>/g, '');
        var kanji = str.replace(/<.*?>/g, '');
        
        for (var i = 0; i < hira.length; i++) {
    
            if ((hira[i] >= "\u4e00" && hira[i] <= "\u9faf") || (hira[i] >= "\u3400" && hira[i] <= "\u4dbf")){
                hira  = hira.replace(hira[i],' ');
            } 
        }
        for(var i = 0; i< hira.length; i++){
            if(hira[i]== ' '){
                hira = hira.replace(hira[i],'');
            }
        }
        str.replace(/<rt.*?>(.*?)<\/rt>/g, function(match, g1) {
            kanji = kanji.replace(g1,'')
        });
        $.ajax({
                url: url,
                type: 'POST',
                data: {
                    text: kanji.trim(),
                    hira: hira,
                    type: 'qsearch',
                    tab: 'word'
                },
                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                success: function(res){
                    $('.box-mean-show').html('');
                    resFound(res);
                    if(res.found){
                        $('#addAnswer').modal('show');
                    }                    
                    return;
    
            },
            error: function(e) {
                console.log(e);
            }
        });
    });
}

function level(jlpt) {
    if (jlpt == "jlpt-n1") {
        $(".jlpt-n5 rt").css('display', 'none');
        $(".jlpt-n4 rt").css('display', 'none');
        $(".jlpt-n3 rt").css('display', 'none');
        $(".jlpt-n2 rt").css('display', 'none');
    }
    if (jlpt == "jlpt-n2") {
        $(".jlpt-n5 rt").css('display', 'none');
        $(".jlpt-n4 rt").css('display', 'none');
        $(".jlpt-n3 rt").css('display', 'none');
    }
    if (jlpt == "jlpt-n3") {
        $(".jlpt-n5 rt").css('display', 'none');
        $(".jlpt-n4 rt").css('display', 'none');
    }
    if (jlpt == "jlpt-n4") {
        $(".jlpt-n5 rt").css('display', 'none');
    }
    if (jlpt == "jlpt-all") {
        $("rt").css('visibility', 'hidden');
    }
}

var levelJlpt = localStorage.getItem('jlpt');
if (levelJlpt == null) {
    $('.select-showFuri').val('jlpt-n1');
    $('.select-showFuri-mb').val('jlpt-n1');
    $("rt").css('visibility', 'visible');
}
else{
    $('.select-showFuri').val(levelJlpt);
    $('.select-showFuri-mb').val(levelJlpt);
    level(levelJlpt);
}

$(".select-showFuri").on('change', function(){
    var jlpt = $(".select-showFuri option:selected").attr('value');
    $("rt").css('visibility', 'visible');
    level(jlpt);
    
    localStorage.setItem('jlpt', jlpt);
})
$(".select-showFuri-mb").on('change', function(){
    var jlpt = $(".select-showFuri-mb option:selected").attr('value');
    $("rt").css('visibility', 'visible');
    level(jlpt);
    
    localStorage.setItem('jlpt', jlpt);
})

$('.icon-setting').on('click', function() {
    $('#settingModal').modal('show');
})
localStorage.setItem('tab-dict', 'word');
$('.vocabulary').addClass('gene-active');

var wordKanjiChoosen;
function vocabulary() {
    var dataSearch = $("#search").val();
    
    if(dataSearch == ''){
        return;
    }
    $.ajax({
        url: "getDict",
        type: 'POST',
        data: {
            text: dataSearch,
            type: 'dict',
            tab:  'word'
        },
        headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
        success: function(res){
            
            $('.box-mean-show').html('');
                
            var string = [];
            var a;
            $('.box-content').html('');
            if(res.found){
                $.each(res.result, function(a,res){
                    var kanji = res.word;
                    var hira  = res.phonetic;
                    var boxHtml = '';
                    boxHtml += `<div class="boxHtml col-md-8">
                                <div class="kanji">` + kanji + `</div>`;
                    boxHtml += `<div class="hira">` + hira + `</div>`;
        
                    $.each(res.means, function(index, item){
                        let tagMean = '';
                        if(item[0].kind != ''){
                            tagMean +=  `<div class="kind">   &#9679; ` + item[0].kind + `</div>`;
                        }
        
                        $.each(item, function(i, val){
                            html = `<p class = "mean-detail">` + "&diams; " +val.mean + `</p>`;
                            if (val.examples != null) {
                                $.each(val.examples, function(x, y){
                                    var content  = y.content;
                                    var meanExam = y.mean;
                                    var trans    = y.transcription;
                                    var tmpDt    = mergeKanjiAndHiragana(content, trans);
                                    var newDt    = '';
                                    if(tmpDt && tmpDt.length > 0) {
                                        var tmpDt = Object.keys(tmpDt).map(function (key) { return tmpDt[key]; });
                                        for(var m = 0; m < tmpDt.length; m++) {
        
                                            var kanji1 = tmpDt[m].k;
                                            var hira1 = tmpDt[m].h;
                                            if(hira1) {
                                                newDt += '<ruby >' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                            } else {
                                                newDt += '<ruby>' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                            }
                                        }
                                        html  += `<p>` + newDt + `</p>`;
        
                                    }else if(tmpDt == null){
                                        html  += `<p>` + content + `</p>`;
                                    }
        
                                html  += `<p>` + meanExam + `</p>`;
                                })
                            }
                        })
                        var meanShow = `<div class="box-mean">
                                            <div class="box-mean-show">`+html+`</div>
                                        </div>`;
                        boxHtml += tagMean;
                        boxHtml += meanShow;
                    });
                    boxHtml += `</div>`;
                    $('.box-content').append(boxHtml);
                })
            }else{
                $('.box-content').html('');
            } 
        },
        error: function(e) {
            console.log(e);
        }
    });
}
function sent(){
    var tab = localStorage.getItem('tab-dict');
    var data = $("#search").val();
    if (tab == 'example') {
        var b = '';
                b += `<div style="font-size: 14px;
                display: grid;
                text-align: center;
                margin-top: 110px;
                color: #c1c1c1;"><a>-Enter Kanji, Hiragana, Romaji.</a>
                <a>Ex:"日本","public","yashashi".</a></div>`;
                $('.box-content').html(b);
        if(langUser !== 'javi'){
            if(!isJapanese(data)){
                data = wanakana.toKana(data);
                $("#search").val(data);
            }
        }
        $.ajax({
            url: "getDict",
            type: 'POST',
            data: {
                text: data,
                tab: tab
            },
            headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
            success: function(res){
                $('.box-content').html('');
                if(res.found){
                    res = res.result;
                    $.each(res.results, function(a, res){
                        var content = res.content;
                        var trans   = res.transcription;
                        var mean    = res.mean;
                        var tmp     = mergeKanjiAndHiragana(content, trans);
                        var newDt    = '';
                        if(tmp && tmp.length > 0) {
                            var tmp = Object.keys(tmp).map(function (key) { return tmp[key]; });
                            for(var m = 0; m < tmp.length; m++) {

                                var kanji1 = tmp[m].k;
                                var hira1 = tmp[m].h;
                                if(hira1) {
                                    newDt += '<ruby >' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                } else {
                                    newDt += '<ruby>' + kanji1 + '<rt>' + hira1 + '</rt> </ruby>';
                                }
                            }
                            // newDt  += `<p>` + newDt + `</p>`;

                        }else if(tmp == null){
                            newDt  += `<p>` + content + `</p>`;
                        }
                        var boxHtml = '';
                        boxHtml += `<div class="boxHtml-sent col-md-8">
                                    <div class="content-sent" >` + newDt + `</div>`;
                        boxHtml += `<div class="mean-sent">` + mean + `</div>`;
                        boxHtml += `</div>`;
                        $('.box-content').append(boxHtml);
                    })
                }
            },
            error: function(e) {
                console.log(e);
            }
    })
    }
    if(tab == 'word') {
        var a = '';
        a += `<div style="    display: grid;
        text-align: center;
        font-size: 14px;
        color: #c1c1c1;
        margin-top: 111px;">
        <a>-Enter Japanese, Hiragana, Romaji or English.</a>
        <a>Ex: "日本","nihon","Japan".</a>
        <a>-Enter capitals for Katakana.</a>
        <a>Ex: "BETONAMU".</a></div>`;
        $('.box-content').html(a);
        vocabulary();
    }
    if(tab == 'kanji') {
        var a = '';
                a += `<div style="font-size: 14px;
                display: grid;
                text-align: center;
                margin-top: 110px;
                color: #c1c1c1;"><a>-Enter Kanji, Hiragana, Romaji.</a>
                <a>Ex:"日本","public".</a></div>`;
                $('.box-content').html(a);
                if(data == ''){
                    return;
                }
        $.ajax({
            url: "getDict",
            type: 'POST',
            data: {
                text: data,
                type: 'kanji',
                tab: tab
            },
            headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
            success: function(res){
                $('.box-content').html('');
                if(res.found){
                    res = res.result;
                    var result = res.results[0];
                    var b = result.detail;
                    var index = b.split("##");
                    var mean= [];
                    var boxKanji = '';
                    var exmKanji ='';
                    var boxHtml = '';
                        exmKanji += `<div class="boxKanji row">`
                        
                    for (i = 0; i < res.results.length; i++) {
                        var kanji = res.results[i].kanji;
                        exmKanji += `<div class="`;
                        var a = '';
                        a +=`list-kanji-`+ i;
                        exmKanji += a + ` boxcss">` + kanji + `</div>`;
                    }
                   
                    exmKanji += `</div>`;
                    data = res.results[0].kanji
                    $('.box-content').append(exmKanji);
                    boxkanji(result,  index, mean, boxKanji, exmKanji, data);
                    $('.list-kanji-0').addClass('kanji-active');
                    $('.boxcss').click(function(){
                        $(".boxcss").removeClass('kanji-active');
                        $(".boxKanji-list").css('display','none');
                        $(".exmKanji").css('display','none');

                        $(this).addClass('kanji-active');
                        var b = ($(this)[0].className).slice(11,12);
                        result = res.results[b];
                        data = result.kanji
                        index = (result.detail).split('##');
                        $('.setting-furi-mb').html(result.kanji);
                        boxkanji(result, index, mean, boxKanji, exmKanji, data);
                        $('.box-content').append(boxKanji);
                    })
                    
                }
            },
            error: function(e) {
                
                var a = '';
                a += `<div  style='    color: #c1c1c1;
                font-size: 14px;
                text-align: center;
                margin-top: 100px;'><a>Not Found !</a></div>`;
                $('.box-content').html(a);
            }
        })
    }
}

function boxkanji(result, index, mean, boxKanji, exmKanji, data) {
    langUser = navigator.language || navigator.userLanguage;
    langUser = langUser.substr(0,2);
    boxKanji += `<div class="boxKanji-list">
                    <div class="kanji-bo">`;
            if(langUser == 'vi'){
                boxKanji += `Bộ: ` ;
            }else{
                boxKanji += `Element: `;
            }
            boxKanji +=  result.kanji + `-`+ result.mean +  `</div>`;
        if(result.kun !== null && typeof result.kun !== 'undefined'){
            boxKanji += `<div class="kanji-kun">` + '訓: ' + result.kun + `</div>`
        }
        if (result.on !== null && typeof result.on !== 'undefined') {
            boxKanji += `<div class="kanji-on">` + '音: ' + result.on + `</div>`;
        }
        if (result.stroke_count !== null && typeof result.stroke_count !== 'undefined') {
            boxKanji += `<div class="kanji-count">`;
            if(langUser == 'vi'){
                boxKanji += 'Số nét: ' ;
            }else{
                boxKanji += `Stroke: `;
            }
            boxKanji += result.stroke_count + `</div>`;
        }
        
        if(result.level !== null && typeof result.level !== 'undefined'){
            boxKanji += `<div class="kanji-level">` + 'Level: ' + result.level + `</div>`;
        }
    
        
        if(result.compDetail !== null  && typeof result.compDetail !== 'undefined'){
            boxKanji += `<div class="kanji-ingredient" style="font-size: 15px;">` + 'Bộ thành phần: ' ;
            for (j = 0; j < result.compDetail.length; j++) {
                boxKanji += result.compDetail[j].w + result.compDetail[j].h ;
                
            }
        }
        
        
        if (index !== null && typeof index !== 'undefined') {
            boxKanji += `<div class="kanji-mean" style="font-size: 15px;">`;
            if(langUser == 'vi'){
                boxKanji += 'Nghĩa: ' ;
            }else{
                boxKanji += `Mean: `;
            };
                for (e = 0; e < index.length; e++) {
                    mean[e] = index[e].split('.')
                    boxKanji +=  mean[e][0] + `, `;
                    // boxHtml+= + mean[e][0] ;
                }
            }
            
            boxKanji += `</div>`;
        boxKanji += `<div class="kanji-interpret" style="font-size: 15px;">`;
        if(langUser == 'vi'){
            boxKanji += 'Giải nghĩa: ' ;
        }else{
            boxKanji += `Detail mean: `;
        };
            if (index !== null && typeof index !== 'undefined') {
                for (e = 0; e < index.length; e++) {
                    boxKanji+= `<div class="a" style="display: list-item;
                    margin-left: 57px;">`+ index[e] +`</div>`;
                    
                }
            }
            
            boxKanji += `</div>`;
    boxKanji += `</div>`;
    resetDrawKanjiStroke(data);
    wordKanjiChoosen = data;
    // $('.box-content').append(boxKanji);

    boxKanji += `<div class="exmKanji">
    <b style='color: rgba(196,19,19,1);
    font-size: 15px; margin-top: 15px;'>`
    if(langUser == 'vi'){
        boxKanji += 'Ví dụ: ' ;
    }else{
        boxKanji += `Examples: `;
    };
    boxKanji+=` </b>
    <table>
        <tr>
            <th class='table-exmKanji'>#</th>
            <th class='table-exmKanji'>`
            if(langUser == 'vi'){
                boxKanji += 'Từ: ' ;
            }else{
                boxKanji += `Vocabulary: `;
            };
            boxKanji+=`</th>
            <th class='table-exmKanji'>Hiragana</th>`
            if(langUser=='vi'){
                boxKanji +=  `<th class='table-exmKanji'>`
                if(langUser == 'vi'){
                    boxKanji += 'Hán việt: ' ;
                }else{
                    boxKanji += `Kanji: `;
                };
                boxKanji+=`</th>`
            }
            
            boxKanji += `<th class='table-exmKanji'>`
            if(langUser == 'vi'){
                boxKanji += 'Nghĩa: ' ;
            }else{
                boxKanji += `Mean: `;
            };
            boxKanji+=`</th>
        </tr>`
        if (result.examples !== null && typeof result.examples !== 'undefined' ) {
            for ( e = 0; e < result.examples.length; e++) {
                boxKanji +=`<tr>
                    <th class='exm-pub exm-stt'>`+ e +`</th>
                    <th class='exm-pub exm-w'>`+ result.examples[e].w+`</th>
                    <th class='exm-pub exm-p'>`+ result.examples[e].p+`</th>`
                    if(langUser =='vi'){
                        boxKanji +=`<th class='exm-pub exm-h'>`+ result.examples[e].h+`</th>`
                    }
                    
                    boxKanji +=`<th class='exm-pub exm-m'>`+ result.examples[e].m+`</th>
                </tr>
                `
            }
        }
        
        
        boxKanji +=`</table>`
    boxKanji += `</div>`;
    $('.box-content').append(boxKanji);
}
function sentences() {
    var a = '';
                a += `<div style="    display: grid;
                text-align: center;
                font-size: 14px;
                color: #c1c1c1;
                margin-top: 111px;">
                <a>-Enter Japanese, Hiragana, Romaji or English.</a>
                <a>Ex: "日本","nihon","Japan".</a>
                <a>-Enter capitals for Katakana.</a>
                <a>Ex: "BETONAMU".</a></div>`;
                $('.box-content').html(a);
    $('#input-search').on('click' ,function(){
        var data = $("#search").val();
        if(data == ''){
           
        }else{
            sent();
        }
        
    })
}
sentences();
// vocabulary();
$('.vocabulary').on('click',function(){
    $('.dict-kanji').removeClass('gene-active');
    $('.sentences').removeClass('gene-active');
    $('.translate').removeClass('gene-active');
    $('.vocabulary').addClass('gene-active');
    localStorage.setItem('tab-dict', 'word');
    sent();
    $('.kanji-draw-container').css('display', 'none');
})
$('.dict-kanji').on('click',function(){
    // $('.box-content').css('display')
    $('.sentences').removeClass('gene-active');
    $('.vocabulary').removeClass('gene-active');
    $('.translate').removeClass('gene-active');
    $('.dict-kanji').addClass('gene-active');
    localStorage.setItem('tab-dict', 'kanji');
    sent();
})
$('.sentences').on('click',function(){
    $('.dict-kanji').removeClass('gene-active');
    $('.vocabulary').removeClass('gene-active');
    $('.translate').removeClass('gene-active');
    $('.sentences').addClass('gene-active');
    localStorage.setItem('tab-dict', 'example');
    sent();
    $('.kanji-draw-container').css('display', 'none');
})
var from =''
var to = ''
$('.translate').on('click',function(){
    $('.dict-kanji').removeClass('gene-active');
    $('.vocabulary').removeClass('gene-active');
    $('.sentences').removeClass('gene-active');
    $('.translate').addClass('gene-active');
    $('.kanji-draw-container').css('display', 'none');
    var htmlTranslate = ''

    htmlTranslate += `<div>
                        <button type="button" value="ja" class="trans-form-to btn-translate">Nhật => Việt</button>
                        <button type="button" value="vi" class="trans-form-to btn-translate">Việt => Nhật</button>
                        <button type="button" class="btn-trans-sent">Dịch</button>
                    </div>
                    <div>
                    <textarea class="translate-sentences text-trans" cols="40" rows="5" placeholder="Nhập câu cần dịch"></textarea>
                    <textarea class="result-trans text-trans" cols="40" rows="5" placeholder=""></textarea>
                    </div>`
    $('.box-content').html(htmlTranslate)

   
    $('.trans-form-to').click(function(){
        from = $(this).val();
        $('.trans-form-to').removeClass('trans-active')
        $(this).addClass('trans-active')
        if (from == 'ja') {
            to = 'vi'
        }else{
            to = 'ja'
        }
    })
    
    $('.btn-trans-sent').on('click',function(){
        var data = $('.translate-sentences').val();
        var url1 = "https://cxl-services.appspot.com/proxy?url=";

        var params = "https://translation.googleapis.com/language/translate/v2/?q=" + normalizeCloudQuery(data) + "&source=" + from + "&target=" + to;

        url = url1 + encodeURIComponent(params);
        function normalizeCloudQuery(data) {
            if (isVietnamese(data)) 
            return data;

            if (isJapanese(data)) {
                data = data.replace(/\s| /g, '');
            }

            return data;
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false ); // false for synchronous request
        xmlHttp.send( null );
       var result = JSON.parse(xmlHttp.responseText);
       $('.result-trans').html(result.data.translations[0].translatedText)
    })
})
// $('.grammar').on('click',function(){
//     $('.dict-kanji').removeClass('gene-active');
//     $('.grammar').addClass('gene-active');
//     $('.vocabulary').removeClass('gene-active');
//     localStorage.setItem('tab-dict', 'grammar');
    
//         $('.op-grammar').css('display', 'block');
// })
// grammar
$('.kanji-draw-container').css('display', 'none');
function getOptionDrawSmall() {
              
    var option = {
        skipLoad: false,
        autoplay: true,
        height: 250,
        width: 250,
        viewBox: {
            x: 0,
            y: 0,
            w: 125,
            h: 125
        },
        step: 0.01,
        stroke: {
            animated: {
                drawing: true,
                erasing: true
            },
            order: {
                visible: true,
                attr: {
                    "font-size": "8",
                    "fill": "#33B5E5"
                }
            },
            attr: {
                "active": "#CC0000",
                // may use the keyword "random" here for random color
                "stroke": "random", //#FF4444
                "stroke-width": 3,
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            }
        },
        grid: {
            show: true,
            attr: {
                "stroke": "#CCCCCC",
                "stroke-width": 0.5,
                "stroke-dasharray": "--"
            }
        }
    };
   
    return option;
}
var dmak2;
function draw(data) {
    dmak2 = new Dmak(data, 
    {
        'width': 200,
        'height': 200,
        'stroke.order.visible': true,
        'element': "image-holder", 
        "stroke": {"attr": {"stroke": "#FF0000"}}, 
        "uri": "http://kanjivg.tagaini.net/kanjivg/kanji/",
        "step": 0.01
    });
    $('.kanji-draw-container').css('display', 'block');
}

function resetDrawKanjiStroke(data) {
    var imageHolder = $("#image-holder");
    imageHolder.html("");
    if (imageHolder.data("plugin_dmak")){
        dmak2.dmak("reset");
        imageHolder.data("plugin_dmak", null);
    }
    
    draw(data);
}

$('#btn-repeat').click(function(){
    resetDrawKanjiStroke(wordKanjiChoosen);
})

$("#input-avatar").on('change', function(){
    readURL(this);
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#avatar-img').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}