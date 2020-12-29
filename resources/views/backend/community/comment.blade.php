@extends('backend.layouts.master')

@section('title', 'Admin-Users')

@section('after-script-end')
<script>
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
              cate: 'comment-community'
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
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">Danh sách bình luận</h3>
            <div class="box-tools">
                
            </div>
        </div>
        <div class="box-body">
            <div class="row">
                <div class="col-md-12 comment-video-type" style="    top: 21px;">
                    <table class="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style="width: 50px;">ID</th>
                            <th style="width: 350px;">Nội dung</th>
                            <th style="width: 150px;">User</th>
                            <th>Thời gian bình luận</th>
                            <th style="text-align: center;width: 20px;">
                                Active
                            </th>
                        </tr>
                        </thead>
                        <tbody class="select-comment">
                            @foreach($comment as $co)
                                <tr>
                                    <td>{{ $co->id }}</td>
                                    <td>{{ $co->content }}</td>
                                    <td>{{ $co->name }}</td>
                                    <td>{{ $co->created_at }}</td>
                                    <td><button class="btn btn-xs waves-effect changeFlag {{ ($co->active == 1) ? 'btn-info' : 'btn-warning' }}" type="button" data-id= "{{$co->active }}" id="{{ $co->id }}"><i class="material-icons">{{ ($co->active == 1) ? 'Hiện' : 'Ẩn'}}</i></button></td>
                                  
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                   
                </div>
            </div>
            @include('backend.includes.pagination', ['data' => $comment, 'appended' => ['search' => Request::get('search')]])
        </div>
    </div>
@endsection