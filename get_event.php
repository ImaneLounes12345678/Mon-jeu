<?php
header('Content-Type: application/json');

$evenements = [
    ["titre" => "Construction de Gizeh", "date" => -2560],
    ["titre" => "Sacre de Charlemagne", "date" => 800],
    ["titre" => "Premier pas sur la Lune", "date" => 1969],
    ["titre" => "Chute de l'Empire Romain", "date" => 476],
    ["titre" => "Découverte de l'Amérique", "date" => 1492],
    ["titre" => "Révolution Française", "date" => 1789],
    ["titre" => "Invention de l'imprimerie", "date" => 1440],
    ["titre" => "Chute du mur de Berlin", "date" => 1989]
];

echo json_encode($evenements[array_rand($evenements)]);
?>
