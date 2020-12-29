@extends('backend.layouts.master')

@section('title', 'Admin-News')

@section('after-styles-end')
    {{ HTML::style('backend/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css') }}
@endsection

@section('after-script-end')
    {{ HTML::script('backend/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}
    {{ HTML::script('backend/bower_components/ckeditor/ckeditor.js') }}

    <script>
        $(function () {
            CKEDITOR.replace('news-content');
            CKEDITOR.on('instanceReady', function(evt) {
                var editor = evt.editor;
                
                editor.on('blur', function(e){
                    var content = CKEDITOR.instances['news-content'].getData();
                    content = content.split('<a href=\"http://a\">').join("<a href='javascript:void(0)' class='dicWin'>");
                    $.ajax({
                        url: "{{ route('admin.Furi') }}",
                        type: 'POST',
                        data: {
                            text: content
                        },
                        headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                        success: function(res){
                            $('.view-news').html(res);
                        },
                        error: function(e) {
                            console.log(e);
                        }
                    });
                })
            });

            // show input edit furi
            $(document).on('click', 'ruby', function(e){
                e.preventDefault();
                var obj  = $(this)[0];
                var html = obj.innerHTML;
                var id  = obj.id;
                var val = '';

                html.replace(/<rt>(.*?)<\/rt>/g, function(match, g1) {
                    val = g1;
                });

                var kanji = html.replace(/<rt>(.*?)<\/rt>/g, '');
                
                $('#input-edit-furi').css( 'position', 'absolute' );
                $('#input-edit-furi').css( 'top', (e.pageY - 45) );
                $('#input-edit-furi').css( 'left', (e.pageX - 20) );

                $('#text-hira-furi').val(val);
                $('#text-hira-furi').attr('name', id);
                $('#text-change-hidden').val(html);
                $('#text-kanji-hidden').val(kanji);
                
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
                var strOld = $('#text-change-hidden').val();
                var strNew = $('#text-hira-furi').val();
                var kanji  = $('#text-kanji-hidden').val();
                var id     = $('#text-hira-furi').attr('name');
                
                var text   = $('#'+id).html();

                text = text.replace(strOld, kanji+'<rt>'+strNew+'</rt>');
                $('#'+id).html(text);   
                    
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
                var str = $(this).val();
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

            $('#link').focusout(function(){
                var link = $(this).val();
                $('.view-link a').attr('href', link);
            })
            
            $('#name-link').focusout(function(){
                var name = $(this).val();
                $('.view-link a').html(name);
            })

            // send form
            $('#btn-send-news').click(function(){
                var title = $('#view-furi-title').html();
                var des   = $('#view-furi-description').html();
                var news  = $('#view-news').html();
                var image = $('#img-news')[0].files[0];
                var pubDate = $('input[name=pubDate]').val();
                var link  = $('input[name=link]').val();
                var video = $('input[name=video]').val();
                var nameLink  = $('input[name=name-link]').val();
                var kind = $('input[name=kind]').val();

                if(title == '' || title == null || news == '' || news == null){
                    alert('Tiêu đề hoặc nội dung rỗng!');
                    return;
                }
                if(pubDate == '' || pubDate == null){
                    alert('Nhập ngày đăng bài.');
                    return;
                }
                if(link == '' || link == null){
                    alert('Trích nguồn.');
                    return;
                }

                var formData = new FormData();
                formData.append('image', image);
                formData.append('description', des);
                formData.append('title', title);
                formData.append('pubDate', pubDate);
                formData.append('content', news);
                formData.append('link', link);
                formData.append('video', video);
                formData.append('kind', kind);
                formData.append('nameLink', nameLink);

                $.ajax({
                    url: '{{ route("admin.create.news") }}',
                    type: 'POST',
                    data: formData,
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    statusCode: {
                        302: function(){
                            swal('Tiêu đề bài báo đã tồn tại.');
                        },
                        500: function(){
                            swal('Có lỗi xảy ra.');
                        }
                    },
                    success: function(res){
                        swal("Good job!", "Thêm bài báo thành công!", "success");
                    },
                    error: function(e) {
                        console.log();
                    }
                });
            })

            $("#img-news").change(function(){
                readURL(this);
            });

            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    
                    reader.onload = function (e) {
                        $('#img-view-news').attr('src', e.target.result);
                    }
                    
                    reader.readAsDataURL(input.files[0]);
                }
            }
        })

        $('#datepicker').datepicker({
            autoclose: true,
            todayHighlight: true
        })
    </script>
@endsection

@section('breadcrumbs')
<section class="content-header">
    <h1>
        Trang chủ
        <small>Báo tuần</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
        <li class="active">Báo tuần</li>
    </ol>
</section>
@endsection

@section('main-content')

<div class="box box-info">
    <div class="box-header">
      <i class="fa fa-files-o"></i>

      <h3 class="box-title">Báo mới</h3>
    </div>
    <form action="{{ route('admin.news') }}" method="POST" name="form-news" enctype="multipart/form-data">
        <div class="box-body">
            <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
            <div class="form-group">
                <label>Ngày đăng:</label>

                <div class="input-group date">
                    <div class="input-group-addon">
                        <i class="fa fa-calendar"></i>
                    </div>
                        <input type="text" name="pubDate" class="form-control pull-right" id="datepicker" placeholder="Ngày đăng" data-date-format="mm/dd/yyyy" readonly>
                </div>
                <!-- /.input group -->
            </div>
            <div class="form-group">
                <label class="title">Tiêu đề:</label>
                <input type="text" class="form-control auto-furi" name="title" id="title" placeholder="Tiêu đề...">
            </div>
            <div class="form-group">
                <label>Mô tả:</label>
                <textarea class="form-control none-resize auto-furi" placeholder="Mô tả..." id="description"  name="description"></textarea>
            </div>
            <div class="form-group">
                <label>Link nguồn:</label>
                <input type="text" class="form-control" placeholder="Link nguồn..." id="link"  name="link">
            </div>
            <div class="form-group">
                <label>Tên nguồn:</label>
                <input type="text" class="form-control" placeholder="Tên nguồn..." id="name-link"  name="name-link">
            </div>
            <div class="form-group">
                <label>Lĩnh vực:</label>
                <input type="text" class="form-control" placeholder="Lĩnh vực..." id="kind"  name="kind">
            </div>
            <div class="form-group">
                <label>Video:</label>
                <input type="file" class="form-control" id="img-news" name="image" placeholder="Hình ảnh" accept="video/mp4,video/x-m4v,video/*">
            </div>
            <div>
                <div class="bg-news-content">
                    <label>Nội dung:</label>
                    <textarea placeholder="Nội dung..." class="textarea" id="news-content" name="content"></textarea>
                </div>
            </div>
            <div class="form-group">
                <label>View:</label>
                {{-- image --}}
                <div class="img-view view-furi">
                    <div class="box-view-audio-video">

                        <img src="" alt="" id="img-view-news">
                    </div>
                </div>
                {{-- title --}}
                <div class="view-title view-furi view-furi-title" id="view-furi-title"></div>

                {{-- description --}}
                <div class="view-furi view-furi-description" id="view-furi-description"></div>

                {{-- content news --}}
                <div class="view-furi view-news" id="view-news"></div>

                <div class="view-link" style="float: right;">
                    ソース：
                    <a href="" target="_blank"></a>
                </div>
            </div>
        </div>
        <div class="box-footer clearfix">
            <button type="button" class="pull-right btn btn-primary" id="btn-send-news">Thêm bài báo
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