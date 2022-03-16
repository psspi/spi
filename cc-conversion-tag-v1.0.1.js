/**
 * --------------------------------------------------------------------------
 * Conversion Tag
 * "Transmission of Sales Numbers"
 * The retailer can transmit sales numbers to Commerce Connector’s platform by using the conversion tag.
 * This enables the collection of successful items sold via the online-shop of the retailer.
 *
 * For integrating the conversion tag into the online-shop of the retailer and connecting it to the interface provided by Commerce Connector
 * a sample code (called "CC-Code" following) is given to the retailer. The CC-Code is based upon Commerce Connectors experience for a working integration.
 * Notwithstanding that the CC-Code is provided to the retailer "as is" hence Commerce Connector provides the CC-Code without warranty for the functionality
 * and security of the CC-Code.
 *
 * The retailer has to test the CC-Code and its usefulness for the retailers purpose and requirements them self prior to using it.
 * Commerce Connector cannot be liable for any claim, damages or other liability, whether in an action or otherwise, arising from,
 * out of or in connection with the CC-Code or the use or other dealings with the CC-Code and  merely stands for, using the CC-Code
 * is not violating any third party rights.
 * --------------------------------------------------------------------------
 */

'use strict';

(function (window) {

    let imgElement,
        imageAttributes = {
            src: 'https://retailer.commerce-connector.com/img.gif',
            shop: '',
            purchases: [],
            eanOrMerchantKey: 'ean',
        };

    /**
     * Initializes the shop with the shopident and type (either 'ean' or 'merchant')
     * @private init - named function expression, available only in the scope of newly created function
     * @param { string } shop
     * @param { string } eanOrMerchantKey
     * @returns { void }
     */
    const _init = function init(shop, eanOrMerchantKey) {
        imgElement = document.createElement('img');
        imgElement.setAttribute('height', '1');
        imgElement.setAttribute('width', '1');
        imgElement.setAttribute('border', '0');
        imageAttributes.src = imageAttributes.src + '?shop=' + shop;
        eanOrMerchantKey === 'merchant'
          ? (imageAttributes.eanOrMerchantKey = eanOrMerchantKey)
          : null;
    };

    /**
     * Renders the conversion tag.
     * @private fire - named function expression, available only in the scope of newly created function
     * @returns { void }
     */
    const _fire = function fire() {
        let finalUrl = imageAttributes.src;

        imageAttributes.purchases.forEach(function (purchase) {
            const purchaseIndex = imageAttributes.purchases.indexOf(purchase);

            finalUrl =
                finalUrl +
                parseParam(
                    imageAttributes.eanOrMerchantKey,
                    purchaseIndex,
                    purchase.eanOrMerchant
                ) +
                parseParam('sale', purchaseIndex, purchase.sale) +
                parseParam('price', purchaseIndex, purchase.price);
            });

        imgElement.setAttribute('src', finalUrl);
        document.getElementsByTagName('head')[0].appendChild(imgElement);

        imageAttributes = {
            src: 'https://conversiontag.commerce-connector.com/tracking/tracking.gif',
            shop: '',
            purchases: [],
            eanOrMerchantKey: 'ean'
        };
    };

    /**
     * Add purchase, sale has a default of 1, if price is empty the price from the product feed is taken.
     * @private addPurchase - named function expression, available only in the scope of newly created function
     * @param {*} eanOrMerchant
     * @param {*} sale
     * @param {*} price
     */
    const _addPurchase = function addPurchase(eanOrMerchant, sale = 1, price) {
        eanOrMerchant = formatEanOrMechant(eanOrMerchant + '');
        eanOrMerchant = eanOrMerchant && eanOrMerchant.length
            ? eanOrMerchant.replace(' ', '')
            : '';

        validateEanOrMechant(eanOrMerchant)
          ? !price
            ? imageAttributes.purchases.push({
                eanOrMerchant,
                sale
              })
            : imageAttributes.purchases.push({
                eanOrMerchant,
                sale,
                price
              })
          : console.warn('CCConversionTag: Incorrect ean or merchant code');
        return this;
      };
    /**
     * Build URL
     * @param {*} param
     * @param {*} index
     * @param {*} value
     * @returns { string } url
     */
    const parseParam = (param, index, value) => {
        return value ? `&${param}[${index}]=${value}` : '';
    };

    /**
     * @param {string} eanOrMerchant
     * @returns { string } formatted ean/merchant
     */
    const formatEanOrMechant = eanOrMerchant => {
        if (imageAttributes.eanOrMerchantKey === 'ean') {
            if (eanOrMerchant && eanOrMerchant.length > 0) return eanOrMerchant.replace(/\D/g, '');
        } else return eanOrMerchant.replace(/[`#&?<>/]/gi, '');
    };

    /**
     * Validate is correct Ean/Merchant key passed
     * @param {string} value
     * @returns { boolean }
     */
    const validateEanOrMechant = (value) => {
        let regExp;

        if (imageAttributes.eanOrMerchantKey === 'ean') {
            regExp = /^\d{1,14}$/;
        } else {
            regExp = /^.{1,14}$/;
        }

        return regExp.test(value);
    };

    /**
     * Expose to global window following methods
     */
    window.CCConversionTag = {
        init: _init,
        addPurchase: _addPurchase,
        fire: _fire,
    }
})(window);
