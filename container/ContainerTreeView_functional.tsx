import React from 'react';
import TreeMap from 'ts-treemap';

import PresentationalTreeView from '../presentational/PresentationalTreeView';

interface Props {
    data: any[],
}

const ContainerTreeView = (props: Props) => {

    const [realMap, setRealMap] = React.useState(new Map());
    const [firstDepth, setFirstDepth] = React.useState([{}]);
    const [selectedKey, setSelectedKey] = React.useState('');
    const [clientX, setClientX] = React.useState<number | null>(null);
    const [clientY, setClientY] = React.useState<number | null>(null);
    const [popupOpen, setPopupOpen] = React.useState(false);

    React.useMemo(() => {
        if (0 !== props.data.length) {
            let treeMap = new TreeMap();

            let array = [...props.data];
            array.map((v) => {
                if (!v.upper_group_name) {
                    let setData = {
                        group_id: v.group_id,
                        group_cd: v.group_cd,
                        group_name: v.group_name,
                        group_lv: v.group_lv,
                        children: [],
                    }
                    treeMap.set(v.group_name, setData);
                } else {
                    let setUpperData = treeMap.get(v.upper_group_name);
                    let setData = {
                        group_id: v.group_id,
                        group_cd: v.group_cd,
                        group_name: v.group_name,
                        group_lv: v.group_lv,
                        upper_group_name: v.upper_group_name,
                        children: [],
                    }
                    setUpperData.children = [...setUpperData.children, v.group_name];

                    treeMap.set(v.upper_group_name, setUpperData);
                    treeMap.set(v.group_name, setData);
                }
                return [];
            })

            let copyMap = new Map();
            copyMap = treeMap;
            let depthArray = new Array();
            copyMap.forEach((v) => {
                if (1 === v.group_lv) {
                    depthArray = [...depthArray, v];
                }
            })

            setFirstDepth(depthArray);
            setRealMap(treeMap);
        }

        return () => { }
    }, [])

    const searchChildrenData = (childArray: any[]) => {
        if (0 !== childArray.length) {
            childArray.map((v) => {
                let childData = realMap.get(v);
                searchChildrenData(childData.children);
                realMap.delete(v);
            })
        }
        return realMap;
    }

    const handleDelete = React.useCallback(() => {
        const deleteData = realMap.get(selectedKey);
        let promise = Promise.resolve();
        if (deleteData.upper_group_name) {
            let upperDeleteData = realMap.get(deleteData.upper_group_name);
            let childArray = [...upperDeleteData.children];
            const index = childArray.indexOf(selectedKey);
            childArray.splice(index, 1);
            upperDeleteData.children = childArray;
            realMap.set(deleteData.upper_group_name, upperDeleteData);
            promise = promise.then(() => {
                return setRealMap(realMap);
            })
        }

        promise = promise.then(() => {
            searchChildrenData(deleteData.children);
        })
        realMap.delete(selectedKey);
        promise
            .then(result => {
                setRealMap(realMap);
                setSelectedKey('');
            })
    }, [selectedKey, realMap])

    const contextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        console.log(e.currentTarget.getBoundingClientRect())
        console.log(e.clientX)
        console.log(e.clientY)

        setClientX(e.clientX);
        setClientY(e.clientY);
        setPopupOpen(true);
    }, [])

    const returnMemo = React.useMemo(() => {
        if (0 === props.data.length) {
            return (<div></div>)
        } else {
            return (
                <PresentationalTreeView
                    firstDepth={firstDepth}
                    realMap={realMap}
                    selectedKey={selectedKey}
                    setSelectedKey={(s: string) => setSelectedKey(s)}
                    handleDelete={() => handleDelete()}
                    contextMenu={(e: React.MouseEvent<HTMLDivElement>) => contextMenu(e)}
                    popupOpen={popupOpen}
                    setPopupOpen={(b: boolean) => setPopupOpen(b)}
                    clientX={clientX}
                    clientY={clientY}
                />
            )
        }
    }, [firstDepth, realMap, selectedKey])


    return (
        <>
            <PresentationalTreeView
                firstDepth={firstDepth}
                realMap={realMap}
                selectedKey={selectedKey}
                setSelectedKey={(s: string) => setSelectedKey(s)}
                handleDelete={() => handleDelete()}
                contextMenu={(e: React.MouseEvent<HTMLDivElement>) => contextMenu(e)}
                popupOpen={popupOpen}
                setPopupOpen={(b: boolean) => setPopupOpen(b)}
                clientX={clientX}
                clientY={clientY}
            />
        </>
    );
}

export default ContainerTreeView;