import test from 'ava';
import { maxPathHelper } from './helpers';

test('maxPathHelper removes "Macintosh HD:" prefix from path', (t) => {
    const input = "Macintosh HD:/Users/JohnDoe/Desktop";
    const expected = "/Users/JohnDoe/Desktop";
    const result = maxPathHelper(input);
    t.is(result, expected);
});

test('maxPathHelper returns path unchanged if "Macintosh HD:" prefix not present', (t) => {
    const input = "/Users/JaneDoe/Downloads";
    const expected = "/Users/JaneDoe/Downloads";
    const result = maxPathHelper(input);
    t.is(result, expected);
});