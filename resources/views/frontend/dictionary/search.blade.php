@extends('frontend.layouts.master')

@section('main-content')
<div class="col">
	<div class="dict-list row">
		<div class="vocabulary dict-gene">{{ trans('lable.dictionary.vocabulary') }}</div>
		<div class="dict-kanji dict-gene">{{ trans('lable.dictionary.kanji') }}</div>
		<div class="sentences dict-gene">{{ trans('lable.dictionary.sentences') }}</div>
		<div class="translate dict-gene">Translate</div>
	</div>
	<div class="input-group row">
		<input type="text" class="form-control" placeholder="Search for..." id="search" onkeypress="return runScript(event)">
		{{-- <ul id="country_list_id"></ul> --}}
		<span class="input-group-btn">
		<button class="btn btn-default" type="submit" id="input-search" >
			<i class="fa fa-search" aria-hidden="true"></i>
		</button>
		</span>
	</div>
	<div class="box-show col-md-12">

<div class="row">
	<div class="dictionary box-content col-md-8 " >
		
		
	</div>
	<div class="kanji-draw-container col-md-4">
		<div id="image-holder"></div>
		
		<div class="kanji-draw-again">
			<button type="button" class="button button-positive button-small ion-loop btn btn-primary btn-sm" id="btn-repeat" style="margin-top: 5px;">
				Vẽ lại
			</button>
		</div>
	</div>
</div>
<div class="box-exam col-md-12"></div>
</div>
</div>

@endsection