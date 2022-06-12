import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Badge, Tree, TreeDataNode, Typography} from "antd";
import InputTooltip from "../../inputTooltip/InputTooltip";
import {categoryAPI} from "../../../../services/CategoriesService";
import Search from "antd/es/input/Search";
// import {Key} from "antd/es/table/interface";
import {ISection} from "../../../../models/ISection";
import {ICategory} from "../../../../models/ICategory";
import {ISubcategory} from "../../../../models/ISubcategory";
import {Key} from "antd/lib/table/interface";
import {randomInt, randomUUID} from "crypto";


interface CategoryTreeProps {
    value?: any
    onChange?: (value: any) => void
}

const CategoryTree: FC<CategoryTreeProps> = ({value={}, onChange}) => {
    const {data: categories, isLoading, isSuccess} = categoryAPI.useGetCategoriesQuery(null)


    const [searchValue, setSearchValue] = useState<string>('')
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false)
    const searchExpandKeys = useRef<Key[]>([])


    const onCurrencyChange = ({checked}: any) => {
        onChange?.({checked})
    }

    const searchComparison = useCallback((name: string, id?: string) => {
        const index = name.toLowerCase().indexOf(searchValue.toLowerCase())
        const title = index > -1 ?
            <span>
                {name.substring(0, index)}
                <span className={'site-tree-search-value'}>{searchValue}</span>
                {name.slice(index + searchValue.length)}
            </span>
            :
            <span>{name}</span>

        if (id && searchValue !== '' && index > -1)
            searchExpandKeys.current.push(String(id))
        return {title}
    },[searchValue])

    // tooltipGenerate(`${prevKey}${item.id}-`, {...parents, category: item.name})
    // tooltipGenerate(`${key}-`, {section: item.name})

    const loop: any = useCallback((data: (ISection  | ICategory | ISubcategory)[], prevKey = '', parents: object) => {
        return [
            ...data.map((item: ISection | ICategory | ISubcategory) => {
                const key = `${prevKey}${item.id}`
                // console.log(item)
                return "categories" in item?{
                    ...searchComparison(item.name),
                    key, selectable: false,
                    children: item.categories.length ? loop(item.categories, `${key}-`, {section: item.name}): []
                }
                : "subcategories" in item ? {
                    ...searchComparison(item.name, key),
                    key, selectable: false,
                    children: item.subcategories.length ? loop(item.subcategories, `${prevKey}${item.id}-`, {...parents, category: item.name}):[]
                } : {
                    ...searchComparison(item.name, key),
                    key, selectable: false,
                }
            }
        ),
            // tooltipGenerate(prevKey, parents)
        ]
    },[searchComparison])

    const tooltipGenerate = (key: string, parents: any) => {
        console.log(key)
        const type = key.split('-').length
        const vars: any = 
          type === 1 ?
          {
              data: {
                  type: 'section',
                  message: 'Раздел $target успешно создан',
              },
              action: 'Создать раздел'
          } 
          : type === 2 ?
            {
                data: {
                    type: 'category',
                    message: 'Категория $target успешно создана',
                    parentSection: parents.section
                },
                action: 'Создать категорию'
            }
            : type === 3 ?
                {
                    data: {
                        type: 'subcategory',
                        message: 'Подкатегория $target успешно создана',
                        parentSection: parents.section,
                        parentCategory: parents.category
                    },
                    action: 'Создать подкатегорию'
                }
              : null
        console.log(vars)
        return {
            title:
              <InputTooltip operator={{data: vars.data, api: categoryAPI.useAddCategoryMutation}}>
                  <Badge color={'blue'}/><Typography.Text style={{color: '#108ee9'}} italic>{vars.action}</Typography.Text>
              </InputTooltip>,
            key: `${key}new`,
            disableCheckbox: true,
            selectable: false,
            checkable: false
        }
    }
    
    const listGenerate: any = useMemo(() => {
        if (isSuccess) return loop(categories)
    },[categories, isSuccess, loop])

    const search = ({target}: any) => {
        setSearchValue(target.value)
        searchExpandKeys.current = []
        setAutoExpandParent(true)
    }

    const onExpand = (keys: Key[]) => {
        setAutoExpandParent(false)
        setExpandedKeys(keys)
    }
    console.log(listGenerate)
    return (

        <>
            {isLoading
            ?
                <h1>Загрузка</h1>
            :
                <>
                    <Search style={{ marginBottom: 8}} placeholder={'Поиск'} onChange={search}/>
                    <Tree
                        checkable
                        treeData={listGenerate}
                        checkStrictly={true}
                        expandedKeys={[...expandedKeys, ...searchExpandKeys.current]}
                        autoExpandParent={autoExpandParent}
                        onExpand={onExpand}
                        onCheck={onCurrencyChange}
                    />
                </>

            }
        </>
    );
};

export default CategoryTree;