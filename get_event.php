<?php
header('Content-Type: application/json');

$evenements = [
    ["titre" => "Construction de Gizeh", "date" => -2560, "type" => "reel"],
    ["titre" => "Invasion Alien en Grèce", "date" => -400, "type" => "fiction"],
    ["titre" => "Sacre de Charlemagne", "date" => 800, "type" => "reel"],
    ["titre" => "Premier pas sur la Lune", "date" => 1969, "type" => "reel"],
    ["titre" => "Chute de l'Atlantide", "date" => -9600, "type" => "fiction"],
    ["titre" => "Découverte de l'Amérique", "date" => 1492, "type" => "reel"],
    ["titre" => "Lancement de Skynet", "date" => 1997, "type" => "fiction"],
    ["titre" => "Révolution Française", "date" => 1789, "type" => "reel"]
];

echo json_encode($evenements[array_rand($evenements)]);
?>