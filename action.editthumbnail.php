<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;

$this->VarDump($params);