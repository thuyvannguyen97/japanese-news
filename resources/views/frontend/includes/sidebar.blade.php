<!-- {!! HTML::style('frontend/css/index.css') !!} -->

<div class="col-md-4">
    <div class="" id="aside">
        <h3 class="title-sidebar">News Related</h3>
        <div class="list-news">
            @foreach($nav as $item)
            <div class="item-news">
                <a class="list-sidebar" href="{{ route('web.detail',['id' => $item->id]) }}" onclick="saveLocalStorage('{{$item->id}}')" id='{{$item->id}}'>
                    <div class="link-sidebar" >{!! $item->title !!}</div>           
                </a>
                <div class="time text-right">
                    {{ $item->created_at }}
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>