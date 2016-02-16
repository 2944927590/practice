  /**
         * 对用户在TextArea中输入的数据进行过滤，把< -> <等操作，以及逆向操作
         */
        
        var ZhangHongYang = {};
        
        ZhangHongYang.htmlFilter = (function ()
        {
            /**
             * 转化textarea中的空格为$nbsp;
             * \n转化为<br/>
             * @private
             */
            function _transSpace(data)
            {
                return data.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
            };

            /**
             * 转化所有尖括号
             * @private
             */
            function _transBrace(data)
            {
                return data.replace(/</g, "<").replace(/>/g, ">");
            };


            function _resumeSpace(data)
            {
                return data.replace(/&nbsp;/g, " ").replace(/<br\s*\/>/ig, "\n");
            };
            function _resumeBrace(data)
            {
                return data.replace(/</g, "<").replace(/>/g, ">");
            };

            return {

                txt2Html: function (data)
                {
                    return _transSpace(_transBrace(data));

                }, 
                html2Txt: function (data)
                {
                    return _resumeSpace(_resumeBrace(data));
                }
            };

        })();
        