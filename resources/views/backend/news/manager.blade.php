@extends('backend.layouts.master')

@section('title', 'Admin-News')

@section('after-styles-end')
    {{ HTML::style('backend/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css') }}
@endsection

@section('after-script-end')
    {{ HTML::script('backend/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}
    <script>
        $('.datepicker').datepicker({
            autoclose: true,
            todayHighlight: true
        })

        $(function(){
            $('.detail-des').click(function(){
                var id = $(this).data('id');
                $.ajax({
                    url: '{{ route("admin.news.getDes") }}',
                    type: 'post',
                    data: {
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        $('.modal-title').html('Mô tả');
                        $('.modal-body').html(res.description);
                        $('#modal-detail').modal('show');
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            
            $('.detail-cont').click(function(){
                var id = $(this).data('id');
                $.ajax({
                    url: '{{ route("admin.news.getContent") }}',
                    type: 'post',
                    data: {
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        $('.modal-title').html('Nội dung');
                        $('.modal-body').html(res.content);
                        $('#modal-detail').modal('show');
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            // action post or delete news
            $('.btn-action-news').click(function(){
                var id = $(this).data('id');
                var status = $(this).data('type');
                var row = $(this).closest("tr");
                $.ajax({
                    url: '{{ route("admin.news.changeStatus") }}',
                    type: 'post',
                    data: {
                        id: id,
                        status: status
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        if(res == 1){
                            swal('Thành công.');
                            row.addClass('hidden');
                        }else{

                        }
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            
            // edit news
            $('.btn-edit-news').click(function(){
                var id = $(this).data('id');
                window.location.href = './../news-edit/' + id;
            })

            // change order for news
            $('.news-order').change(function(){
                var order = $(this).val();
                var data  = $(this).find(':selected').data('id');
                var id = data[0];  // 0: id, 1: news_order_old
                var order_old = data[1];
                var pubDate = $(this).find(':selected').data('type');

                $.ajax({
                    url: '{{ route("admin.news.changeOrder") }}',
                    type: 'post',
                    data: {
                        order: order,
                        id: id,
                        order_old: order_old,
                        pubDate: pubDate
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        window.location.reload();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })

            $('.btn-edit-pubDate').on('click', function(){
                var id = $(this).data('id');
                var pubDate = $('input[id='+id+']').val();
                
                console.log(pubDate)
                $.ajax({
                    url: '{{ route("admin.ajax.pubDate") }}',
                    type: 'post',
                    data: {
                        pubDate: pubDate,
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        window.location.reload();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
        })
    
    </script>
@endsection

@section('breadcrumbs')
<section class="content-header">
    <h1>
        Trang chủ
        <small>Báo Nhật</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.dashboard') }}"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
        <li class="">Báo Nhật</li>
        <li class="active">Quản lý bài báo</li>
    </ol>
</section>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header with-border">
        <h3 class="box-title">Danh sách.</h3>
        <div class="box-tools">
            <form method="GET" action="">
                <div class="input-group" style="width: 200px;">
                    <input type="text" name="search" class="form-control input-sm pull-right" placeholder="Nhập tiêu đề">
                    <div class="input-group-btn">
                    <button type="submit" class="btn btn-sm btn-default"><i class="fa fa-search"></i></button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="box-body">
        <div class="margin-bottom">
            <form class="form-inline">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                <div class="form-group">
                <label class="sr-only">
                    Trạng thái
                </label>
                <select class="form-control fillter_width_url">
                    <option {{ ($module == "new") ? "selected":"" }} 
                    value="new">Mới thêm</option>
                    @if(Auth::guard('admin')->user()->role == 1 || Auth::guard('admin')->user()->role == 0)
                        <option {{ ($module == "posted") ? "selected":"" }} 
                        value="posted">Chờ Phát hành</option>
                        <option {{ ($module == "success") ? "selected":"" }} 
                        value="success">Đã phát hành</option>
                        <option {{ ($module == "deleted") ? "selected":"" }} 
                        value="deleted">Tạm ngừng</option>
                    @endif
                </select>
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <table class="table table-striped table-bordered table-hover tbl-vertical-middle">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                            <th>Nội dung</th>
                            <th>Lĩnh vực</th>
                            <th>Ngày đăng</th>
                            <th>Bình luận</th>
                            <th style="width: 131px;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($news as $key => $item)
                            <tr>
                                <td>{{ $key + 1 }}</td>
                                <td>{!! $item->title !!}</td>
                                <td>{!! $item->des_short !!} ... <a href="javascript:void(0)" class="detail-des" data-id="{{ $item->id }}">Chi tiết</a></td>
                                <td><a href="javascript:void(0)" class="detail-cont" data-id="{{ $item->id }}">Chi tiết</a></td>
                                <td>{{ $item->kind }}</td>
                                <td style="    width: 112px;">
                                    <input type="text" name="pubDate" id="{{ $item->id }}" class="form-control pull-right datepicker" placeholder="Ngày đăng" data-date-format="mm/dd/yyyy" readonly value="{{ $item->pubDate }}">
                                    @if(in_array($module, ['posted', 'new']))
                                    <a class="btn-edit-pubDate" data-id="{{ $item->id }}" style="cursor: default;">Sửa</a>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ route('admin.cmt-manager', ['new' =>  $item->id]) }}"><span>Chi tiết</span></a>
                                </td>
                                <td>
                                    @if($item->status == 0)
                                        <div class="btn-group">

                                        @if(in_array(Auth::guard('admin')->user()->role, [0,1]))
                                            <button type="button" class="btn btn-info btn-sm btn-post-news btn-action-news" data-id="{{ $item->id }}" data-type="1" data-toggle="tooltip" title="Đăng bài"><i class="fa fa-upload"></i></button>
                                        @endif
                                            <button type="button" class="btn btn-primary btn-sm btn-edit-news" data-id="{{ $item->id }}" data-toggle="tooltip" title="Sửa bài"><i class="fa fa-pencil-square-o"></i></button>
                                            <button type="button" class="btn btn-danger btn-sm btn-del-news btn-action-news" data-id="{{ $item->id }}" data-type="-1" data-toggle="tooltip" title="Xóa bài"><i class="fa fa-trash-o"></i></button>
                                        </div>
                                    @elseif($item->status == -1)
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-info btn-sm btn-undel-news btn-action-news" data-id="{{ $item->id }}" data-type="0" data-toggle="tooltip" title="Khôi phục"><i class="fa fa-refresh"></i></button>
                                        </div>
                                    @elseif($module == 'success')
                                        <div>
                                            <a href="{{ route('admin.translate-manager', ['id'=> $item->id]) }}">Bản dịch</a>
                                        </div>
                                    @endif
                                    
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <!--Phân trang-->
        @include('backend.includes.pagination', ['data' => $news, 'appended' => ['search' => Request::get('search')]])
        <div class="clearfix"></div>
    </div>
</div>
{{-- modal --}}
<div class="modal fade" tabindex="-1" role="dialog" id="modal-detail">
    <div class="modal-dialog custom-modal-detail-news" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"></h4>
        </div>
        <div class="modal-body">
            
        </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
@endsection