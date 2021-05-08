import React, { useState } from 'react';
import '../binary-expansion/style.css'
import { v4 as uuidv4 } from 'uuid';

const Latex = require('react-latex');
type Nullable<T> = T | null | undefined;

const colors = poorColorGenerator(30)

export class LinkedListTreeNode<T> {
    private next: Nullable<Array<LinkedListTreeNode<T>>>;
    constructor(private value: T) { };


    addNext(nextValue: T) {
        if (!this.next) {
            this.next = [];
        }
        this.next.push(new LinkedListTreeNode(nextValue));
        return this.next;
    }
}

function multiply(a: any, b: any) {
    return {
        value: `${a.value}${b.value}`,
        id: uuidv4(),
        parent: a.id
    }

}

function recursiveTick<T>(growths: Array<any>) {
    let newArray = []
    for (let term of growths) {
        newArray.push(term);
        newArray.push(multiply(term, { value: 'a', id: uuidv4() }))
        newArray.push(multiply(term, { value: 'b', id: uuidv4() }))

    }
    return newArray;
}

type Datum = { id: string, parent: string, value: string, selected: boolean }
function selectChildren(selectedId: string, data: Array<Datum>) {
    const family = new Set<string>();
    return data.map(data => {
        if (selectedId === data.parent || (family.has(data.parent) && false)) {
            family.add(data.id);
            return { ...data, selected: true }
        } else return { ...data }
    })
}

function reset(data: Array<Datum>) {
    return data.map(dataum => ({
        ...dataum,
        selected: false
    }));

}

function handleClicks(event: MouseEvent, data: Array<Datum>, details: { value: string, id: string }) {
    if (event.ctrlKey) {
        return selectSimilar(details.value, data);
    } else {
        return selectChildren(details.id, data);
    }
}

export function BinaryExpansion(props: { power: number }) {

    const [generations, setGenerations] = useState<Array<any>>([{ id: uuidv4(), value: '1', selected: false, parent: '' }]);
    const [ticks, setTicks] = useState<number>(0);

    return <div>
        <div>
            <button onClick={e => {
                setGenerations(recursiveTick(generations));
                setTicks(ticks + 1);
            }}>Tick</button>

            <button onClick={e => {
                setGenerations([{ value: '1', selected: false, id: uuidv4(), parent: '' }]);
                setTicks(0);
            }}>Reset</button>

            <button onClick={e => {
                setGenerations(reset(generations));
                
            }}>Reset Selection alone</button>
        </div>
        <div>
            <h5>
                Generators - {ticks}
            </h5>
        </div>
        <section>
            {
                generations.map((term, idx) => {
                    return (
                        <span
                            data-parent={term.parent}
                            data-id={term.id}
                            onClick={e => setGenerations(handleClicks(e as any as MouseEvent, generations, term))}
                            style={{ marginRight: '1rem', color: term.selected ? 'red' : '' }}
                            key={`${term.value}${idx}`}>
                            {term.value}
                        </span>
                    )
                })
            }
        </section>
    </div>
}

function selectSimilar(value: string, data: Array<Datum>) {
    return data.map(term => {
        if (term.value === value) {
            return {
                ...term,
                selected: true
            }
        } else {
            return { ...term };
        }
    })
}

function poorColorGenerator(length: number) {
    const colors = new Array(length);
    let startColor = 0xf0f0f0;
    for (let i = 0; i < length; i++) {
        colors[i] = `#${Number(startColor).toString(16)}`;
        startColor += 0xf0;
    }

    return colors;
}