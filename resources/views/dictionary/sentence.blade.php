@extends('dictionary.main')
@section('dict-main')
@if(isset($des))
    @section('description', $des)
@endif
@if(isset($type) && $type == 'example')
<div label="Mẫu câu" class="col-md-6 col-xs-12 result-example" style="padding: 0px;">
	@if(isset($result) && !empty($result))
	<div class="examples-list widget-container">
		@foreach($result as $key => $value)
		<div class="example-container">
			<div class="example-word sentence-exam japanese-char">
				<span>{!! $value->mean !!}</span>
			</div>
			<div class="example-mean-word sentence-exam">
				<span>{!! $value->content !!}</span>
			</div>
		</div>
		@endforeach
	</div>
	@else
	<div class="no-result">
		Not found any related example to: <b>{{ $query }}</b>
	</div>
	@endif
</div>
@endif
@stop