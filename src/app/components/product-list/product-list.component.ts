import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number;
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit():  {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    this.listProducts();
  }

  const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

  if (hasCategoryId){
    this.currentCateggoryId = +this.route.snapshot.paramMap.get('id');
  }
  else{
    this.currentCategoryId = 1;
  }


  listProducts(){
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
