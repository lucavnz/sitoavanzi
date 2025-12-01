import { defineField, defineType } from 'sanity'

export const motorcycle = defineType({
    name: 'motorcycle',
    title: 'Motorcycle',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'brand',
            title: 'Brand',
            type: 'string',
            options: {
                list: [
                    { title: 'KTM', value: 'KTM' },
                    { title: 'HUSQVARNA', value: 'HUSQVARNA' },
                    { title: 'VOGE', value: 'VOGE' },
                    { title: 'KYMCO', value: 'KYMCO' },
                    { title: 'BETA', value: 'BETA' },
                    { title: 'FANTIC', value: 'FANTIC' },
                    { title: 'PIAGGIO', value: 'PIAGGIO' },
                    { title: 'DUCATI', value: 'DUCATI' },
                    { title: 'BMW', value: 'BMW' },
                ],
            },
        }),
        defineField({
            name: 'year',
            title: 'Year',
            type: 'number',
        }),
        defineField({
            name: 'displacement',
            title: 'Cilindrata (cc)',
            type: 'number',
        }),
        defineField({
            name: 'isUsed',
            title: 'Usato?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isFeatured',
            title: 'In Evidenza (Homepage)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'kilometers',
            title: 'Chilometri',
            type: 'number',
            hidden: ({ document }) => !document?.isUsed,
        }),
        defineField({
            name: 'catchphrase',
            title: "Frase d'effetto",
            description: "Una frase breve e d'impatto per catturare l'attenzione",
            type: 'string',
        }),
        defineField({
            name: 'summary',
            title: 'Riassunto Breve',
            description: "Spiegazione in due righe della moto",
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
    ],
})
