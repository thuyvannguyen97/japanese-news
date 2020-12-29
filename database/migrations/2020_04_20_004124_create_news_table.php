<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateNewsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('news', function(Blueprint $table)
		{
			$table->integer('id', true);
			$table->integer('user_id');
			$table->string('pubDate', 20);
			$table->integer('news_order')->default(0);
			$table->text('title', 65535);
			$table->string('kind')->nullable();
			$table->text('link', 65535)->nullable();
			$table->text('video', 65535)->nullable();
			$table->string('name_link')->nullable();
			$table->integer('view')->nullable();
			$table->text('description', 65535)->nullable();
			$table->text('content');
			$table->boolean('status')->default(0)->comment('0: created, 1: posted, -1: deleted, 2: success');
			$table->timestamps();
			$table->string('image')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('news');
	}

}
