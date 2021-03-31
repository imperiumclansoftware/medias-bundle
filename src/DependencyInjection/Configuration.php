<?php

namespace ICS\MediaBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{

    public function getConfigTreeBuilder()
    {
        $treebuilder = new TreeBuilder('medias');

        $treebuilder->getRootNode()->children()
            ->scalarNode('path')->defaultValue('medias')->end()
        ;

        return $treebuilder;
    }


}