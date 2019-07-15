<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();?>
<?
$frame = $this->createFrame()->begin();
$frame->setAnimation(true);
$arParams["COUNT_IN_LINE"] = intval($arParams["COUNT_IN_LINE"]);
$arParams["COUNT_IN_LINE"] = (($arParams["COUNT_IN_LINE"] > 0 && $arParams["COUNT_IN_LINE"] < 12) ? $arParams["COUNT_IN_LINE"] : 3);
$colmd = floor(12 / $arParams['COUNT_IN_LINE']);
$colsm = floor(12 / round($arParams['COUNT_IN_LINE'] / 2));
$bShowImage = in_array('PREVIEW_PICTURE', $arParams['FIELD_CODE']);
?>
<div class="catalog item-views table catalos_sections_block">
	<?if($arResult["SECTIONS"]):?>

		<div class="row items">
			<?foreach($arResult["SECTIONS"] as $arItem):?>
				<?
				// edit/add/delete buttons for edit mode
				$arSectionButtons = CIBlock::GetPanelButtons($arItem['IBLOCK_ID'], 0, $arItem['ID'], array('SESSID' => false, 'CATALOG' => true));
				$this->AddEditAction($arItem['ID'], $arSectionButtons['edit']['edit_section']['ACTION_URL'], CIBlock::GetArrayByID($arItem['IBLOCK_ID'], 'SECTION_EDIT'));
				$this->AddDeleteAction($arItem['ID'], $arSectionButtons['edit']['delete_section']['ACTION_URL'], CIBlock::GetArrayByID($arItem['IBLOCK_ID'], 'SECTION_DELETE'), array('CONFIRM' => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));

				// preview image
				if($bShowImage){
					$bImage = strlen($arItem['PICTURE']);
					$arImage = ($bImage ? CFile::ResizeImageGet($arItem['PICTURE'], array('width' => 256, 'height' => 192), BX_RESIZE_IMAGE_PROPORTIONAL_ALT, true) : array());
					$imageSrc = ($bImage ? $arImage['src'] : SITE_TEMPLATE_PATH.'/images/noimage_product.png');
				}
				// use order button?
				$bOrderButton = true;
				?>
				<?$arItem["DETAIL_PAGE_URL"] = CIBlock::ReplaceDetailUrl(str_replace('filter_search','catalog', $arParams["DETAIL_URL"]), $arItem, true, "E");?>
				<div class="col-md-<?=$colmd?> col-sm-<?=$colsm?> col-xs-<?=$colsm?>">
					<div class="item<?=($bShowImage ? '' : ' wti')?>" id="<?=$this->GetEditAreaId($arItem['ID'])?>" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product">
						<div>
						<?if($bShowImage):?>
							<div class="image">
								<a href="<?=$arItem['SECTION_PAGE_URL']?>" class="blink" itemprop="url">
									<img class="img-responsive" src="<?=$imageSrc?>" alt="<?=($bImage ? $arItem['FIELDS']['PREVIEW_PICTURE']['ALT'] : $arItem['NAME'])?>" title="<?=($bImage ? $arItem['FIELDS']['PREVIEW_PICTURE']['TITLE'] : $arItem['NAME'])?>" itemprop="image" />
								</a>
							</div>
						<?endif;?>
						
						<div class="text">
							<div class="cont">
								<?// element name?>
								<div class="title">
									<a href="<?=$arItem['SECTION_PAGE_URL']?>" itemprop="url" class="color_link">
										<span itemprop="name"><?=$arItem['NAME']?></span>
									</a>
								</div>

								<?/*
								<?// element section name?>
								<?if(strlen($arItem['SECTION_NAME'])):?>
									<div class="section_name"><?=$arItem['SECTION_NAME']?></div>
								<?endif;?>
								*/?>

								<?// element status?>
								<?/*if(strlen($arItem['DISPLAY_PROPERTIES']['STATUS']['VALUE'])):?>
									<span class="label label-<?=$arItem['DISPLAY_PROPERTIES']['STATUS']['VALUE_XML_ID']?>" itemprop="description"><?=$arItem['DISPLAY_PROPERTIES']['STATUS']['VALUE']?></span>
								<?endif;?>
								
								<?// element article?>
								<?if(strlen($arItem['DISPLAY_PROPERTIES']['ARTICLE']['VALUE'])):?>
									<span class="article" itemprop="description"><?=GetMessage('S_ARTICLE')?>: <span><?=$arItem['DISPLAY_PROPERTIES']['ARTICLE']['VALUE']?></span></span>
								<?endif;*/?>
								
							</div>
							<div class="row1 foot"></div>
							</div>
						</div>
					</div>
				</div>
			<?endforeach;?>
			
			<?// slice elements height?>
			<script type="text/javascript">
			var templateName = '<?=$templateName?>';
			$(document).ready(function(){
				if(!jQuery.browser.mobile){
					$('.catalog.item-views.table .item .image').sliceHeight({lineheight: -4});
					$('.catalog.item-views.table .item .title').sliceHeight();
					$('.catalog.item-views.table .item .cont').sliceHeight();
					$('.catalog.item-views.table .item .foot').sliceHeight();
					$('.catalog.item-views.table .item').sliceHeight({'classNull':'.footer_button'});
				}
			});
			</script>
		</div>

	<?endif;?>

</div>
<?$frame->end();?>