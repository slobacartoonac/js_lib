function sign (p1, p2, p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle ( pt,  v1,  v2,  v3)
{
    var b1 = sign(pt, v1, v2) < 0.0;
    var b2 = sign(pt, v2, v3) < 0.0;
    var b3 = sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}
function dot(a,b)                        { return (a.x*b.x) + (a.y*b.y); }
function perpDot(a,b)                    { return (a.y*b.x) - (a.x*b.y); }

function lineCollision( A1, A2,
                    B1, B2 )
{
    var a={x:A2.x-A1.x,y:A2.y-A1.y};
    var b={x:B2.x-B1.x,y:B2.y-B1.y};

    var f = perpDot(a,b);
    if(!f)      // lines are parallel
        return false;
    
    var c={x:B2.x-A2.x,y:B2.y-A2.y};
    var aa = perpDot(a,c);
    var bb = perpDot(b,c);

    if(f < 0)
    {
        if(aa > 0)     return false;
        if(bb > 0)     return false;
        if(aa < f)     return false;
        if(bb < f)     return false;
    }
    else
    {
        if(aa < 0)     return false;
        if(bb < 0)     return false;
        if(aa > f)     return false;
        if(bb > f)     return false;
    }
    return true;
}

export {
    pointInTriangle,
    dot,
    perpDot,
    lineCollision,
    sign
}