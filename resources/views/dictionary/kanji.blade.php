@extends('dictionary.main')
@section('dict-main')
@section('url', $url)
@if(isset($des))
    @section('description', $des)
@endif
@if(isset($title))
    @section('title', $title)
@endif
@if(isset($type) && $type == 'kanji')
<div label="Hán tự" >
	@if(isset($result) && !empty($result))
	<div class="list-kanji">
		<div class="btn-group">
			@foreach($result as $key => $value)
			<button type="button" class="btn btn-default btn-lg draw-single-kanji" ng-click="changeKanjiShow({{ $key }});" ng-class="kanjiSeletectClass({{ $key }});">{{ $value->kanji }}</button>
			@endforeach
		</div>
		<div id="kanji-detail-result">
			<div class="kanji-container">
				<div class="col-md-6 col-sx-12">
					@foreach($result as $key => $value)
					<div class="kanji-main-infor widget-container" ng-if="currentKanjiSelected == {{ $key }}">
						<div class="add-note-me">
							<button  ng-click="setQueryType(data.kanji, 'kanji');" class="btn btn-sm btn-default" data-toggle="modal" data-target="#myNote">
								<span class="glyphicon glyphicon-plus"></span>
							</button>
						</div>
						<div class="pronoun-item"><span class='kunyomi-text'>Kanji: </span><span>{{ $value->kanji }}</span></div>
						@if($value->kun != '' && $value->kun != null)
						<div class="pronoun-item japanese-char"><span class='kunyomi-text'>訓:</span>  {{ $value->kun }} </div>
						@endif
						@if($value->on != '' && $value->on != null)
						<div class="pronoun-item japanese-char"><span class='kunyomi-text'>音:</span>  {{ $value->on }} </div>
						@endif
						@if($value->stroke_count != null)
						<div class="pronoun-item"><span class='kunyomi-text'>Number stroke:</span> {{ $value->stroke_count }} </div>
						@endif
						@if($value->level != null)
						<div class="level"><span class='kunyomi-text'>JLPT:</span> {{ $value->level }}</div>
						@endif
						@if(isset($value->compDetail) && $value->compDetail != null)
						<div class="comp-detail"><span class='kunyomi-text'>Element suite: </span>
							@foreach($value->compDetail as $k => $val)
							<span class="kanji-component">
								{{ $val->w }} 
								@if($val->h != '')
								<span> {{ $val->h }}</span>
								@endif
							</span>
							@endforeach
						</div>
						@endif
						<div class="short-mean"><span class='kunyomi-text'>Mean: </span>            
							{{ $value->mean }}
						</div>
					</div>
					@endforeach
				</div>
				<div class="col-md-6 col-xs-12">
					<div class="kanji-draw widget-container">
						<ng-kanji-draw data="data.kanji"></ng-kanji-draw>
					</div>
				</div>
				<div class="example-kanji widget-container col-md-12">
					<b>Example :</b>
					<table class="table">
						<thead>
							<tr>
								<th class="table-col-1">#</th>
								<th class="table-col-2">Word</th>
								<th class="table-col-3">Hiragana</th>
								<th class="table-col-5">Mean</th>
							</tr>
						</thead>
						<tbody>
							@foreach($result as $key => $value)
							@if($key == "<% currentKanjiSelected %>" && !empty($value->examples))
							@foreach($value->examples as $k => $val)
							<tr>
								<td class="table-col-1">{{ $k + 1 }}</td>
								<td class="table-col-2" ng-click="searchKan('{{ $val->w }}')" class="japanese-char">{{ $val->w }}</td>
								<td class="table-col-3" class="japanese-char">{{ $val->p }}</td>
								<td class="table-col-5">{{ $val->m }}</td>
							</tr>
							@endforeach
							@endif
							@endforeach
						</tbody>
					</table>
				</div>
			</div>
		</div>
		@endif
		@if(isset($noKanji) && empty($noKanji))
		<div class="no-result">
			Not data about kanji: <b>{{ $query or '' }}</b>
		</div>
		@endif
	</div>
	@endif
	@stop