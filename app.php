<?php
$sat = new SQLite3('sat.db');

$list = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/tables.list";
$schema = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/schemas/";
$data = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/data/";

$listaText = file_get_contents($list);
$lines = array_filter(array_map('trim',explode("\n", $listaText)));

foreach ($lines as $line) {
    echo "\x1b[33m" . $line . "\x1b[0m \n";

    $schemaText = file_get_contents($schema . $line . ".sql");
    echo $schemaText . "\n";
    $sat->exec($schemaText);

    $dataText = file_get_contents($data . $line . ".sql");
    $dataLines = array_filter(array_map('trim',explode("\n", $dataText)));
    foreach ($dataLines as $dataLine) {
        echo "\x1b[2m" . $dataLine . "\x1b[0m \n";
        $sat->exec($dataLine);
    }

    echo "\x1b[32m data done\n \x1b[0m \n";
}