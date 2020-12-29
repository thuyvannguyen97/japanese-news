<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSentenceTranslateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sentence_translate', function(Blueprint $table)
		{
			$table->integer('id', true);
			$table->integer('new_id');
			$table->string('content', 200)->nullable();
			$table->integer('sentence_id');
			$table->timestamps();
			$table->integer('user_id');
			$table->boolean('active');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('sentence_translate');
	}

}
