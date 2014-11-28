<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;

echo "function InlineEditorMicroTiny() {\n";
header('Content-Type: text/javascript');
require_once(cms_join_path($this->GetModulePath(), 'lib', 'MicroTinyHelper.php'));
echo MicroTinyHelper::GenerateConfig();
echo "\n}";