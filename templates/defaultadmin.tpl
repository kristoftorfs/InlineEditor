<!-- Inline Editor -->
<link rel="stylesheet" href="{$assetUrl}/stylesheet.css" type="text/css" />
<script type="text/javascript" src="{$assetUrl}/init.js"></script>
<script type="text/javascript" src="{$assetUrl}/spotlight.js"></script>
<!-- Configuration -->
<div id="inline-editor-helper" data-site="{$site_id}" data-assetUrl="{$assetUrl}" data-writeUrl="{$writeUrl}" data-actionId="{$actionid}">
    <a class="spotlight-editor" href=""><img src="{$editIcon}" alt="Bewerken" title="Bewerken"></a>
    {$thumbForm}
</div>
<!-- Module contents -->
<div id="inline-editor-buttons">
    <input disabled="disabled" type="submit" name="start" value="Bewerken starten">
    <input disabled="disabled" type="submit" name="cancel" value="Bewerken stoppen">
</div>
<div id="inline-editor-editors" title="Bewerken">
    <input type="text" value="" class="string editor">
    <div id="htmlarea" class="text editor">
        {$textarea}
    </div>
</div>
<div id="inline-editor-frame"><iframe id="inline-editor" src="{root_url}"></iframe></div>