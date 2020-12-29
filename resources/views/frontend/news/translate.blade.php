@extends('frontend.layouts.master')
@section('after-script')
<script type="text/javascript">
   $(function(){
        $(".translate-user").click(function(){
            
            var user_id = $(this).data('id');
            var new_id  = $('.trans-selected').data('id');
            console.log(new_id)
            $.ajax({
                url: "{{ route('getTrans') }}",
                type: 'POST',
                data: {
                    user: user_id,
                    new: new_id
                },
                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                success: function(res){
                    console.log(res);
                    $(".translate-input").css('display','none')
                    for (var i = 0; i < res.length; i++) {
                        boxContent = `<p>` + res[i].content + `</p>`
                        $('.translate-show-'+(i+1)).html(boxContent)
                        $('.trans-selected').removeClass('background')
                        
                    }
                   
                   
    
            },
            error: function(e) {
                console.log(e);
            }
        });

        });
   })
</script>
@endsection
@section('main-content')
<div class="col-md-8">
    <form action="{{  route('addTranslate', ['id'=> $new_id ]) }}" method="post">
        <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
        <div class="translate-content col-md-8">
            @foreach($data as $key => $value)
                <div class="box-trans">
                    <div style="line-height: 40px; color: rgba(196,19,19,1); padding-top: 15px;">
                    </div>
                        <div id="translate-{{ $key +1 }}"  class="translate-0"><i class="fas fa-arrow-right"></i>  {!! $value !!} </div>
                        <div id="translate-show"  class="translate-show-{{ $key+1 }}"></div>
                        <textarea name="trans-input-{{ $key +1 }}" cols="40" rows="5" class="translate-input" aria-valuetext="kk"></textarea><br>
                </div>
            @endforeach
            
        </div>
        <button class="btn-save-trans">Lưu</button>
    </form> 
</div> 
<div class="translate-other col-md-4">
        <div>
            <a href="">{{ trans('lable.translate.back') }}</a>
        </div>
        <a>{{ trans('lable.translate.list-trans') }}</a>
        <hr/> 
        @foreach ($list as $i => $da)
        <div class="translate-user" data-id="{{ $da['id'] }}">
            <div class="trans-selected " data-id="{{ $da['new_id'] }}">
                <a>{!!$da['name']!!}</a><br>
            </div>
        </div>
        @endforeach
    </div>
    @include('frontend.modal.dict')
   
@endsection