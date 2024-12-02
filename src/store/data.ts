import { reactive } from 'vue'

export const database = reactive({
    companyData: {
        'list': [
            {
                "id": 1,
                "name": "华为技术有限公司",
                "location": "北京",
                "industry": "制造业",
                "scale": "大型",
                "space": "xxxxx",
                "industry_service": "xxxxx",
                "life_and_infrastructure": "xxxxx",
                "talents": "xxxxx",
                "others": "xxxxx",
                "source": "xxxxx"
            },
            {
                "id": 2,
                "name": "阿里巴巴集团",
                "location": "上海",
                "industry": "农业",
                "scale": "中型",
                "space": "xxxxx",
                "industry_service": "xxxxx",
                "life_and_infrastructure": "xxxxx",
                "talents": "xxxxx",
                "others": "xxxxx",
                "source": "xxxxx"
            },
            {
                "id": 3,
                "name": "腾讯科技有限公司",
                "location": "广州",
                "industry": "销售",
                "scale": "小型",
                "space": "xxxxx",
                "industry_service": "xxxxx",
                "life_and_infrastructure": "xxxxx",
                "talents": "xxxxx",
                "others": "xxxxx",
                "source": "xxxxx"
            },
        ],
        pager: {
            page: 1,
            pageSize: 20,
            total: 3
        }
    }
})