<!DOCTYPE html>
<html lang="en" class="no-js" ng-app="mazii">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>@yield('title')</title>
  <meta name="description" content="@yield('description')" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href='https://fonts.googleapis.com/css?family=Roboto:400,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="{{ url('app/bower_components/bootstrap/dist/css/bootstrap.css') }}">
  <link rel="stylesheet" href="{{ url('app/fonts/Font-Awesome-master/css/font-awesome.min.css') }}">
  <link rel="stylesheet" href="{{ url('app/app.css') }}">
  <link rel="stylesheet" href="{{ url('app/css/mobile.css') }}">
  <link rel="stylesheet" href="{{ url('app/css/app.css') }}">
  <link rel="stylesheet" href="{{ url('app/myStyle.css') }}">
  <link rel="stylesheet" href="{{ url('app/css/bootstrap-extra-modal.css') }}">
  <link rel="icon" href="{{ url('app/imgs/favicon.ico') }}">

  <meta property="og:title" content="@yield('title')" />
  <meta property="og:image" content="" />
  <meta property="og:url" content="@yield('url')" />
  <meta property="og:site_name" content="Easy Japanese" />
  <meta property="og:description" content="@yield('description')" />
  <meta property="fb:app_id" content="1544160779141926" />
  <meta property="og:type" content="website"/>
  
  <meta name="Mazii" content="author" />

  <meta name="keywords" content="nhk,easy,japanese,nihongo,easy japanese,nhk easy japanese, nhk news, japanese news, asahi, nippon, japanese quiz, jlpt, jisho, dictionary, mazii, mazzi, dict" />

  <meta name="robots" content="index,follow" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <base href="/">
</head>
<body role="document">

  @include('header')

  <div class="history-panel">
    <ng-history></ng-history>
  </div>
  
  <div class="setting-panel">
    <!-- <ng-setting></ng-setting> -->
  </div>

  <div class="container-fluid" id="main-contain">
      <div class="row">
          <div id="view1" class="{{ (isset($news)) ? 'col-lg-8 col-md-8 col-xs-12' : 'col-lg-12 col-md-12 col-xs-12' }}"> 
              @yield('main')
          </div>
          <div id="view2" class="{{ (isset($news)) ? 'col-lg-4 col-md-4 col-xs-12' : '' }}">
              @yield('right')
          </div>
          <div id="view3">
          </div>
      </div>
  </div>


  @include('footer')
  
  @yield('modal')
  
  
  
  <script src="{{ url('app/bower_components/jquery/dist/jquery.js') }}"></script>
  <script src="{{ url('app/bower_components/bootstrap/dist/js/bootstrap.js') }}"></script>
    
  <script src="{{ url('app/bower_components/wanakana/lib/wanakana.js') }}"></script>
  <script src="{{ url('app/libs/dmark.js') }}"></script>
  <script src="{{ url('app/libs/handwriter.js') }}"></script>
  <script src="{{ url('app/libs/parse.min.js') }}"></script>
  <script src="{{ url('app/libs/socket.io.js') }}"></script>
  <script src="{{ url('app/libs/scrollheader.js') }}"></script>
  <script src="{{ url('app/libs/fastclick.js') }}"></script>
  <script src="{{ url('app/libs/bootstrap-extra-modal.js') }}"></script>
  <script src="{{ url('app/libs/common.js') }}"></script>
  
  <script src="{{ url('app/bower_components/angular/angular.min.js') }}"></script>
  <script src="{{ url('app/bower_components/angular-route/angular-route.js') }}"></script>
  <script src="{{ url('app/bower_components/angular-ui-router/release/angular-ui-router.js') }}"></script>
  <script src="{{ url('app/bower_components/angular-sanitize/angular-sanitize.js') }}"></script>
  <script src="{{ url('app/bower_components/ngAudio/app/angular.audio.js') }}"></script>
  <script src="{{ url('app/app.js') }}"></script>
  
  <script src="{{ url('app/services/historyServices.js') }}"></script>
  <script src="{{ url('app/services/searchServices.js') }}"></script>
  <script src="{{ url('app/services/utilServices.js') }}"></script>
  <script src="{{ url('app/services/categoryServ.js') }}"></script>    
  <script src="{{ url('app/services/localStoreServices.js') }}"></script>    
  
  <script src="{{ url('app/components/word/word-directive.js') }}"></script> 
  <script src="{{ url('app/components/example/example-directive.js') }}"></script>
  <script src="{{ url('app/components/kanji/kanji-directive.js') }}"></script>
  <script src="{{ url('app/components/grammar/grammar-directive.js') }}"></script>
  <script src="{{ url('app/components/kanji-result-search-word/kanji-result-search-word-directive.js') }}">
  </script>
  <script src="{{ url('app/components/kanji-recognize/kanji-recognize-directive.js') }}"></script>
  <script src="{{ url('app/components/kanji-draw/kanji-draw-directive.js') }}"></script>
  <script src="{{ url('app/components/history/history-directive.js') }}"></script>
  <script src="{{ url('app/components/google-translate/google-translate-directive.js') }}"></script>
  <script src="{{ url('app/components/synonyms/synonyms-directive.js') }}"></script>
  <script src="{{ url('app/components/focus/focus.js') }}"></script>
  

  <script>
    window.addEventListener('load', function() {
      FastClick.attach(document.body);
    }, false);
    window.onload = function() {
    var element = document.getElementById("search-text-box");
    if(element){
      if (element.length > 0) {
        elment.focus();  
      }  
    }
  }
  </script>
  <script type="text/javascript">
    $(document).ready(function () {
      var str = $('#search-text-box').val();
      $('#search-text-box').focus().val(str);
    });

    
  </script>
</body>
</html>
