{if $cmsversion eq 2}<script type="text/javascript" src="{cms_action_url action="microtiny" suppress="1"}"></script>{/if}
<!-- Inline Editor -->
<link rel="stylesheet" href="{$assetUrl}/stylesheet.css" type="text/css" />
<script type="text/javascript" src="{$assetUrl}/init.js"></script>
<script type="text/javascript" src="{$assetUrl}/spotlight.js"></script>
<!-- Configuration -->
<div
    id="inline-editor-helper"
    data-site="{$site_id}"
    data-assetUrl="{$assetUrl}"
    data-writeUrl="{$writeUrl}"
    data-actionId="{$actionid}"
    data-cms-version="{$cmsversion}"
{foreach $lang as $key => $value}
    data-lang-{$key}="{$value|htmlentities}"
{/foreach}
    {if isset($gotoName)}data-autoEdit="{$gotoName}"{/if}
    >
    <a class="spotlight-editor" href=""><img src="{$editIcon}" alt="{$lang.edit|htmlentities}" title="{$lang.edit|htmlentities}"></a>
    {$thumbForm}
</div>
<!-- Module contents -->
<div id="inline-editor-buttons">
    <input disabled="disabled" type="submit" name="start" value="{$lang.startedit|htmlentities}">
    <input disabled="disabled" type="submit" name="cancel" value="{$lang.stopedit|htmlentities}">
</div>
<div id="inline-editor-editors" title="{$lang.edit|htmlentities}">
    <input type="text" value="" class="string editor">
    <div id="htmlarea" class="text editor">
        {if isset($textarea)}{$textarea}{else}<textarea id="textarea" cols="80" rows="10"></textarea>{/if}
    </div>
    <div class="link editor">
        <label for="linktext">Tekst:</label>
        <input type="text" id="linktext" name="linktext" value="">
        <label for="linkhref">Pagina:</label>
        {$linkhref}
    </div>
</div>
<div id="inline-editor-frame"><iframe id="inline-editor" src="{if !isset($gotoSrc)}{root_url}{else}{$gotoSrc}{/if}"></iframe></div>