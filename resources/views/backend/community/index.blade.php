@extends('backend.layouts.master')

@section('title', 'Admin-Users')

@section('after-script-end')
<script>

// $('.select-topic').change(function(){
//     var topic_id = (".select-topic option:selected").attr('value');
//     console.log(top)
// })

$('.changeFlag').click(function(){
      var id = $(this).attr('id');
      var status = $(this).data('id');
      var current = $(this);
      status =  Math.abs(1-status);
      $.ajax({
          url: "{{ route('backend.ajax.comment') }}",
          type: 'post',
          data: {             
              id: id,
              status: status,
              cate: 'community'
          },
          headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
          success: function(res){
              current.data('id', status);
              current.removeClass((status == 0) ? 'btn-info' : 'btn-warning');
              current.addClass((status == 1) ? 'btn-info' : 'btn-warning');
              current.html((status == 1) ? '<i class="material-icons">Hiện</i>' : '<i class="material-icons">Ẩn</i>');
          },
          error: function(e) {
              console.log();
          }
      });
    });
    </script>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header with-border">
        <div class="col-md-4">
            <h3>Chủ đề</h3>
            <select class="select-topic"  onchange="location = this.value;">
                <option value="{{ route('admin.community-manager', ['cate' => 'all']) }}" {{ ($cate == "all") ? "selected":"" }}>Tất cả</option>
                @foreach($topic as $t)
                <option value="{{ route('admin.community-manager', ['cate' => $t->id]) }}" {{ ($cate == $t->id) ? "selected":"" }}>{{ $t->name }}</option>
                @endforeach
            </select>
        </div>
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
        <div class="row">
            <div class="col-sm-12">
                <table class="table table-striped table-bordered table-hover tbl-vertical-middle">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Người đăng</th>
                            <th>Tiêu đề</th>
                            <th>Nội dung</th>
                            <th>Lĩnh vực</th>
                            <th>Ngày đăng</th>
                            <th>Trạng thái</th>
                            <th>Bình luận</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($question as $key => $item)
                            <tr>
                                <td>{{ $key + 1 }}</td>
                                <td>{{ $item->name }}</td>
                                <td>{{ $item->title }}</td>
                                <td>{{ $item->content }}</td>
                                <td>{{ $item->name_topic }}</td>
                                <td>{{ $item->created_at }}</td>
                                <td><button class="btn btn-xs waves-effect changeFlag {{ ($item->active == 1) ? 'btn-info' : 'btn-warning' }}" type="button" data-id= "{{$item->active }}" id="{{ $item->id }}"><i class="material-icons">{{ ($item->active == 1) ? 'Hiện' : 'Ẩn'}}</i></button></td>
                                <td><a href="{{ route('admin.community-comment-manager', ['community_id' => $item->id]) }}">Chi tiết</a></td>
                                
                     
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <!--Phân trang-->
        @include('backend.includes.pagination', ['data' => $question, 'appended' => ['search' => Request::get('search')]])
        <div class="clearfix"></div>
    </div>
</div>
@endsection