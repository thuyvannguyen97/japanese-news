@extends('backend.layouts.master')

@section('title', 'Admin-News')

@section('after-styles-end')
    {{ HTML::style('backend/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css') }}
@endsection

@section('after-script-end')
    {{ HTML::script('backend/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}
    {{ HTML::script('backend/bower_components/ckeditor/ckeditor.js') }}
    <script>
        function randomNumber(){
            var text = "";
            var possible = "0123456789";
            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }

        $("body").on('click', 'rt', function(e){
            e.preventDefault();
            var obj  = $(this)[0];
            var id   = randomNumber();
            $(this).attr('id', id);

            var val = obj.innerText.trim();

            $('#input-edit-furi').css( 'position', 'absolute' );
            $('#input-edit-furi').css( 'top', (e.pageY - 45) );
            $('#input-edit-furi').css( 'left', (e.pageX - 20) );

            $('#text-hira-furi').val(val);
            $('#text-hira-furi').attr('name', id);
            $('#text-change-hidden').val(val);
            // $('#text-kanji-hidden').val(kanji);
            
            $('#input-edit-furi').removeClass('hidden');
            $('#text-hira-furi').focus();
            
        });

        // hide input edit furi
        $(document).on('click', '#delete-furi-edit', function(e){
            e.preventDefault();
            $('#input-edit-furi').addClass('hidden');
        })

        // save edit input furi
        $(document).on('click', '#save-furi-edit', function(e){
            e.preventDefault();
            var strNew = $('#text-hira-furi').val();
            var id     = $('#text-hira-furi').attr('name');
            
            $('#'+id).html(strNew);   
                
            $('#input-edit-furi').addClass('hidden');          
        })

        $('#text-hira-furi').focus(function(event){
            event.preventDefault();
            // Tao phim tat
            $(this).keyup(function(e){
                // enter auto save
                if(e.keyCode == 13){ 
                    $('#save-furi-edit').click();
                }
                if(e.keyCode == 27){ 
                    $('#delete-furi-edit').click();
                }
            });
        });  
        $('.auto-furi').focusout(function(){
            var str = $(this).html().trim();
            var name  = $(this).attr('name');
            str = str.replace(/\r\n|\n|\r/g, '<br />');
            $.ajax({
                url: "{{ route('admin.Furi') }}",
                type: 'POST',
                data: {
                    text: str
                },
                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                success: function(res){
                    $('.view-furi-' + name).html(res);
                },
                error: function(e) {
                    console.log(e);
                }
            });
        })
        
        // send form edit
        $('#btn-send-news').click(function(){
            var title = $('#view-furi-title').html().trim();
            var description = $('#view-furi-description').html().trim();
            var content = $('#view-furi-content').html().trim();


            var data = new FormData();
            data.append('title', title);
            data.append('description', description);
            data.append('content', content);

            $.ajax({
                url: "{{ route('admin.news.editNews', $id) }}",
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                success: function(res){
                    res = res.trim();
                    if(res == 'success'){
                        alert('Success');
                        window.location.reload(true);
                    }else{
                        alert('Có lỗi xảy ra.');
                    }
                    
                },
                error: function(e) {
                    console.log(e);
                }
            });
        })
    </script>
@endsection

@section('breadcrumbs')
<section class="content-header">
    <h1>
        Trang chủ
        <small>Edit</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.dashboard') }}"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
        <li class=""><a href="{{ route('admin.news.manager', 'new') }}">Quản lý bài báo</a></li>
        <li class="active">Edit</li>
    </ol>
</section>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header">
      <i class="fa fa-files-o"></i>

      <h3 class="box-title">Báo mới</h3>
    </div>
    
    <form action="" method="POST" name="form-news" enctype="multipart/form-data">
        <div class="box-body">
            <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
            <div class="form-group">
                <label>Ngày đăng:</label>

                <div class="input-group date">
                    <div class="input-group-addon">
                        <i class="fa fa-calendar"></i>
                    </div>
                        <input type="text" name="pubDate" class="form-control pull-right" id="datepicker" placeholder="Ngày đăng" data-date-format="mm/dd/yyyy" readonly value="{{$news->pubDate}}">
                </div>
                <!-- /.input group -->
            </div>
            <div class="form-group">
                <label class="title">Tiêu đề:</label>
                <p type="text" class="form-control auto-furi" id="title" name="title" contenteditable="true">{!! $title !!}</p>
            </div>
            
            <div class="form-group">
                <label>Mô tả:</label>
                <div class="form-control none-resize auto-furi" id="description" name="description"  contenteditable="true" style="    height: auto;">{!! $description !!}</div>
            </div>
            <div class="form-group">
                <label>Nội dung:</label>
                <div class="form-control auto-furi" id="content" name="content"  contenteditable="true" style="    height: auto;">{!! $content !!}</div>
            </div>

            <div class="form-group" id="view-content" style="font-size: 22px;     margin: 60px;">
                <label>View:</label>
                {{-- title --}}
                <div contenteditable="false" class="view-title view-furi view-furi-title" id="view-furi-title" name="title">
                    {!! $news->title !!}
                </div>

                {{-- description --}}
                <div class="view-furi view-furi-description" id="view-furi-description" name="description">
                    {!! $news->description !!}
                </div>

                {{-- content news --}}
                <div class="view-furi view-news view-furi-content" id="view-furi-content" name="content">
                    {!! $news->content !!}
                </div>

                <div class="view-link" style="float: right;">
                    ソース：
                    <a href="{{ $news->link }}" target="_blank">{{ $news->name_link }}</a>
                </div>
            </div>
        </div>
        <div class="box-footer clearfix">
            <button type="button" class="pull-right btn btn-primary" id="btn-send-news">Sửa bài báo
                <i class="fa fa-arrow-circle-right"></i></button>
        </div>
    </form>
</div>
<div class="input-group hidden" id="input-edit-furi">
    <input type="text" name="" class="form-control pull-left" id="text-hira-furi">
    <input type="hidden" name="" class="form-control pull-left" id="text-change-hidden">
    <input type="hidden" name="" class="form-control pull-left" id="text-kanji-hidden">
    <div class="input-group-addon" id="save-furi-edit">
        <i class="fa fa-check"></i>
    </div>
    <div class="input-group-addon" id="delete-furi-edit">
        <i class="fa fa-trash-o"></i>
    </div>
</div>
@endsection