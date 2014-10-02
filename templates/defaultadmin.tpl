<!-- Inline Editor -->
<link rel="stylesheet" href="{$assetUrl}/stylesheet.css" type="text/css" />
<script type="text/javascript" src="{$assetUrl}/init.js"></script>
<script type="text/javascript" src="{$assetUrl}/spotlight.js"></script>
<!-- Configuration -->
<div id="inline-editor-helper" data-site="{$site_id}" data-assetUrl="{$assetUrl}"></div>
<!-- Module contents -->
<div id="inline-editor-buttons">
    <input disabled="disabled" type="submit" name="start" value="Bewerken starten">
    <input disabled="disabled" type="submit" name="cancel" value="Bewerken stoppen">
</div>
<div id="inline-editor-editors">
    <p><strong>Bewerken</strong></p>
    <input type="text" value="" class="editor">
    <div class="buttons">
        <input type="submit" name="save" value="Opslaan">
        <input type="submit" name="cancel" value="Annuleren">
    </div>
</div>
<div id="inline-editor-frame"><iframe id="inline-editor" src="{root_url}"></iframe></div>