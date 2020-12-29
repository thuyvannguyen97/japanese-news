<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', 'JPN')</title>
    <meta name="description" content="@yield('description')" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
    
    <!-- LIBRARIES -->
    <link href="http://vjs.zencdn.net/4.6.1/video-js.css" rel="stylesheet">
  <script src="http://vjs.zencdn.net/4.6.1/video.js"></script>
  
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mediaelement/4.2.9/mediaelement-and-player.min.js"></script> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mediaelement/4.2.9/mediaelementplayer.css">
    <!-- IconLink -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    
    {{--font-awsome--}}
    <script src="https://use.fontawesome.com/c73754228e.js"></script>
    @yield('before-styles-end')
    @yield('after-styles-end')
    @yield('before-css')
    {!! HTML::style('frontend/css/main.css') !!}
    {!! HTML::style('frontend/css/skin.css') !!}
    {!! HTML::style('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic') !!}
    
    @yield('after-css')
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-62602489-25"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-62602489-25');
    </script>
</head>

<body id="body">
    <!-- START PAGE SOURCE -->

    <!-- HEADER -->
    @include('frontend.includes.header')
    <!-- START PAGE SOURCE -->
    <div class="container">      
        <div id="section" class="row" >           
            @yield('main-content')
           
            <!-- MENU -->
            @yield('sidebar')
        </div>
    </div>
    <!-- FOOTER -->
    @include('frontend.includes.footer')  

    
    @yield('before-script')
    {!! HTML::script('frontend/js/japanese.js') !!}
    {!! HTML::script('app/bower_components/wanakana/lib/wanakana.min.js') !!}
    {!! HTML::script('frontend/js/cufon-yui.js') !!}
    {!! HTML::script('frontend/js/font.font.js') !!}
    {!! HTML::script('frontend/js/raphael.js') !!}
    {!! HTML::script('frontend/js/dmak.js') !!}
    {!! HTML::script('frontend/js/dmakLoader.js') !!}
    {!! HTML::script('frontend/js/jquery.dmak.js') !!}
    {!! HTML::script('frontend/js/jquery.dmak.min.js') !!}
    {!! HTML::script('frontend/js/common.js') !!}

    <script type="text/javascript">
        $(function(){
            $('body').on('click', '.btn-load', function(e){
                e.preventDefault();
                var page = parseInt($(this).attr('data-id'));
                var name = $(this).attr('name');
                var prevPage = (page <= 2) ? 1 : (page - 1);
                var nextPage = (page < 2) ? 2 : (prevPage + 2);
                
                $.ajax({
                    url: '{{ route("web.news.ajax.head") }}',
                    type: 'POST',
                    data: {
                        page: page
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        var html = '';
                        $.each(res, function(i, item){
                            var img = item.value.image;
                            img = img.replace("easy//..", "html");
                            var url = '{{ route("web.detail", ":slug") }}';
                            url = url.replace(':slug', item.id);
                            var li = `<li>
                                <a href="`+url+`" onclick="saveLocalStorage('` + item.id +`')" id='` + item.id +`'>
                                    <div class="row" > 
                                        <div class="col-md-5">
                                            <div class="img-bg-default">
                                                <img src="` + img + `" alt="" class="f-left img-menu-news" />
                                            </div>
                                        </div>
                                        <div class="col-md-7" >` + item.value.title + `</div>            
                                    </div>
                                </a>
                            </li>`;
                            html += li;
                        })
                        $('.next').attr('data-id', nextPage);
                        $('.pre').attr('data-id', prevPage);
                        $('.list-title-menu').html(html);
                        
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            
            

            $('.ensign').on('click', function(){
                $('#languageModal').modal('show');
        
                
            });
        })
    </script>

    @yield('after-script')
<!-- END PAGE SOURCE -->
<script src="//mazii.net/embedded/mazii.mini.js"></script>
</body>
</html>
