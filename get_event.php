<?php
header('Content-Type: application/json');

$evenements = [
    ["titre" => "Gizeh", "date" => -2560],
    ["titre" => "Charlemagne", "date" => 800],
    ["titre" => "Premier pas sur la Lune", "date" => 1969],
    ["titre" => "Chute de Rome", "date" => 476],
    ["titre" => "Découverte de l'Amérique", "date" => 1492],
    ["titre" => "Révolution Française", "date" => 1789],
    ["titre" => "L'Imprimerie", "date" => 1440],
    ["titre" => "Chute du Mur de Berlin", "date" => 1989],
    ["titre" => "Code de Hammurabi", "date" => -1750],
    ["titre" => "Bataille de Marignan", "date" => 1515],
    ["titre" => "Déclaration d'Indépendance USA", "date" => 1776],
    ["titre" => "Prise de la Bastille", "date" => 1789],
    ["titre" => "Fin de l'Apartheid", "date" => 1994],
    ["titre" => "Invention du Cinéma", "date" => 1895],
    ["titre" => "Chute de Constantinople", "date" => 1453]
];

echo json_encode($evenements[array_rand($evenements)]);
?>
