<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title')</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    @yield('before-styles-end')
    {!! HTML::style('backend/bower_components/bootstrap/dist/css/bootstrap.min.css') !!}
    {!! HTML::style('backend/bower_components/font-awesome/css/font-awesome.min.css') !!}
    {!! HTML::style('backend/bower_components/Ionicons/css/ionicons.min.css') !!}
    {!! HTML::style('backend/dist/css/AdminLTE.min.css') !!}
    {!! HTML::style('backend/dist/css/skins/_all-skins.min.css') !!}
    {!! HTML::style('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic') !!}
    {!! HTML::style('backend/css/myStyles.css') !!}
    {!! HTML::style('backend/plugins/sweetalert/sweetalert.css') !!}
    @yield('after-styles-end')
    
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="hold-transition skin-blue sidebar-mini">
    <div class="wrapper">
        
        @include('backend.includes.header')

        @include('backend.includes.sidebar')

        <!-- Main content -->
        <div class="content-wrapper">
            @yield('breadcrumbs')
            
            <section class="content">
                @yield('main-content')
            </section>
        </div>

        @include('backend.includes.footer')
    </div>
    <!-- ./wrapper -->

    @yield('before-script-end')
    {!! HTML::script('backend/bower_components/jquery/dist/jquery.min.js') !!}
    {!! HTML::script('backend/bower_components/jquery-ui/jquery-ui.min.js') !!}
    {!! HTML::script('backend/bower_components/bootstrap/dist/js/bootstrap.min.js') !!}
    {!! HTML::script('backend/dist/js/adminlte.min.js') !!}
    {!! HTML::script('backend/dist/js/demo.js') !!}
    {!! HTML::script('backend/plugins/sweetalert/sweetalert.min.js') !!}
    {!! HTML::script('backend/js/common.js') !!}
    @yield('after-script-end')

    <script>
        $.widget.bridge('uibutton', $.ui.button);
    </script>
</body>
</html>
