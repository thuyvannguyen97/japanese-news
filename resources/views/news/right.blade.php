@section('right')
<div class="news-block">
	<div class="older-news widget-container japanese-char">
    <div class="news-title">他のニュース</div>
    <hr class="other-news-hr-heading">
	<div class="news-link">
	    <?php foreach ($headNews as $key => $value): ?>
	    <a href="{{ url('news') }}/{{ $value->id }}" id="{{ $value->id }}" class="links-news-title {{ ($value->id == $id) ? 'news_active' : '' }}">
	    	<p>{!! $value->value->title !!}</p>
	    </a>
	    <?php endforeach ?>
	</div>
    </div>
</div>
</div>
@stop