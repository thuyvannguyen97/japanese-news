@extends('backend.layouts.master')

@section('title', 'Admin')

@section('main-content')
    <h1>Chào mừng <strong>{{ Auth::guard('admin')->user()->name }}</strong> đến trang quản trị (^-^)</h1>
@endsection